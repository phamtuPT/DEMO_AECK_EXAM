const express = require('express');
const cors = require('cors');
const fs = require('fs-extra');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');

// Check if running on Vercel
const isVercel = process.env.VERCEL === '1' || process.env.VERCEL_ENV;
let kv = null;

// Try to import Vercel KV if available
if (isVercel) {
  try {
    const { kv: kvClient } = require('@vercel/kv');
    kv = kvClient;
    console.log('✅ Vercel KV imported successfully');
  } catch (error) {
    console.log('⚠️ Vercel KV not available, using memory storage');
    console.log('Error:', error.message);
  }
}

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'aeck-secret-key-2024';

// Middleware
app.use(cors());
app.use(express.json());

// Ensure data is initialized on every request (for Vercel)
app.use(async (req, res, next) => {
  if (isVercel && !global.memoryStorage.initialized) {
    await initializeVercelData();
  }
  next();
});

// Data file paths
const DATA_DIR = path.join(__dirname, 'data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const EXAMS_FILE = path.join(DATA_DIR, 'exams.json');
const QUESTIONS_FILE = path.join(DATA_DIR, 'questions.json');
const RESULTS_FILE = path.join(DATA_DIR, 'results.json');

// Ensure data directory exists
fs.ensureDirSync(DATA_DIR);

// Initialize data files if they don't exist
const initializeDataFiles = async () => {
  try {
    // Initialize users file
    if (!await fs.pathExists(USERS_FILE)) {
      const defaultUsers = [
        {
          id: 1,
          email: "admin@aeck.com",
          password: await bcrypt.hash("admin123", 10),
          role: "admin",
          name: "Admin AECK",
          createdAt: new Date().toISOString(),
          isActive: true
        },
        {
          id: 2,
          email: "student1@gmail.com",
          password: await bcrypt.hash("123456", 10),
          role: "student",
          name: "Nguyễn Văn An",
          createdAt: new Date().toISOString(),
          isActive: true
        },
        {
          id: 3,
          email: "student2@gmail.com",
          password: await bcrypt.hash("123456", 10),
          role: "student",
          name: "Trần Thị Bình",
          createdAt: new Date().toISOString(),
          isActive: true
        }
      ];
      await fs.writeJson(USERS_FILE, defaultUsers, { spaces: 2 });
    }

    // Initialize other files
    if (!await fs.pathExists(EXAMS_FILE)) {
      await fs.writeJson(EXAMS_FILE, [], { spaces: 2 });
    }
    if (!await fs.pathExists(QUESTIONS_FILE)) {
      await fs.writeJson(QUESTIONS_FILE, [], { spaces: 2 });
    }
    if (!await fs.pathExists(RESULTS_FILE)) {
      await fs.writeJson(RESULTS_FILE, [], { spaces: 2 });
    }

    console.log('✅ Data files initialized successfully');
  } catch (error) {
    console.error('❌ Error initializing data files:', error);
  }
};

// Global in-memory storage for Vercel (persists across requests)
global.memoryStorage = global.memoryStorage || {
  users: [],
  exams: [],
  questions: [],
  results: [],
  initialized: false
};

// Helper functions for hybrid storage
const readData = async (key) => {
  try {
    if (isVercel && kv) {
      // Try Vercel KV first
      const data = await kv.get(key);
      console.log(`📖 Reading ${key} from KV:`, data ? 'found' : 'not found');
      return data || [];
    } else if (isVercel) {
      // Fallback to global memory storage on Vercel
      const data = global.memoryStorage[key] || [];
      console.log(`📖 Reading ${key} from memory:`, data.length, 'items');
      return data;
    } else {
      // Local file system
      const filePath = path.join(DATA_DIR, `${key}.json`);
      return await fs.readJson(filePath);
    }
  } catch (error) {
    console.error(`Error reading ${key}:`, error);
    return [];
  }
};

const writeData = async (key, data) => {
  try {
    if (isVercel && kv) {
      // Try Vercel KV first
      await kv.set(key, data);
      console.log(`💾 Saved ${key} to KV:`, data.length, 'items');
      return true;
    } else if (isVercel) {
      // Fallback to global memory storage on Vercel
      global.memoryStorage[key] = data;
      console.log(`💾 Saved ${key} to memory:`, data.length, 'items');
      return true;
    } else {
      // Local file system
      const filePath = path.join(DATA_DIR, `${key}.json`);
      await fs.writeJson(filePath, data, { spaces: 2 });
      return true;
    }
  } catch (error) {
    console.error(`Error writing ${key}:`, error);
    return false;
  }
};

// Auth middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// Routes

// Health check
app.get('/api/health', async (req, res) => {
  const users = await readData('users');
  res.json({
    status: 'OK',
    message: 'AECK Server is running',
    timestamp: new Date().toISOString(),
    environment: isVercel ? 'Vercel' : 'Local',
    storage: isVercel && kv ? 'Vercel KV' : isVercel ? 'Memory' : 'File',
    userCount: users.length,
    initialized: global.memoryStorage?.initialized || false
  });
});

// Debug endpoint to check storage
app.get('/api/debug/storage', async (req, res) => {
  try {
    const users = await readData('users');
    const userEmails = users.map(u => ({ id: u.id, email: u.email, role: u.role }));

    res.json({
      environment: isVercel ? 'Vercel' : 'Local',
      storage: isVercel && kv ? 'Vercel KV' : isVercel ? 'Memory' : 'File',
      initialized: global.memoryStorage?.initialized || false,
      userCount: users.length,
      users: userEmails,
      memoryStorage: isVercel ? Object.keys(global.memoryStorage).map(key => ({
        key,
        count: Array.isArray(global.memoryStorage[key]) ? global.memoryStorage[key].length : 'N/A'
      })) : 'Not applicable'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// User registration
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email and password are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    // Check if user exists
    const users = await readData('users');
    const existingUser = users.find(user => user.email === email);

    if (existingUser) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    // Create new user
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
      id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1,
      name,
      email,
      password: hashedPassword,
      role: 'student',
      isActive: true,
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    await writeData('users', users);

    // Generate token
    const token = jwt.sign(
      { id: newUser.id, email: newUser.email, role: newUser.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Return user without password
    const { password: _, ...userWithoutPassword } = newUser;

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user: userWithoutPassword,
      token
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// User login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find user
    const users = await readData('users');
    const user = users.find(u => u.email === email && u.isActive);

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Return user without password
    const { password: _, ...userWithoutPassword } = user;

    res.json({
      success: true,
      message: 'Login successful',
      user: userWithoutPassword,
      token
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get user statistics (admin only) - MUST be before /api/users
app.get('/api/users/stats', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const users = await readData('users');

    const stats = {
      total: users.length,
      active: users.filter(u => u.isActive).length,
      inactive: users.filter(u => !u.isActive).length,
      admins: users.filter(u => u.role === 'admin').length,
      students: users.filter(u => u.role === 'student').length,
      recentRegistrations: users.filter(u => {
        const createdDate = new Date(u.createdAt);
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return createdDate > weekAgo;
      }).length
    };

    res.json({
      success: true,
      stats
    });

  } catch (error) {
    console.error('Get user stats error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all users (admin only)
app.get('/api/users', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const users = await readData('users');
    const usersWithoutPasswords = users.map(({ password, ...user }) => user);

    res.json({
      success: true,
      users: usersWithoutPasswords,
      total: usersWithoutPasswords.length
    });

  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update user (admin only)
app.put('/api/users/:id', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const userId = parseInt(req.params.id);
    const { name, email, role, isActive } = req.body;

    const users = await readData('users');
    const userIndex = users.findIndex(u => u.id === userId);

    if (userIndex === -1) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if email is already used by another user
    const emailExists = users.find(u => u.email === email && u.id !== userId);
    if (emailExists) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    // Update user
    users[userIndex] = {
      ...users[userIndex],
      name: name || users[userIndex].name,
      email: email || users[userIndex].email,
      role: role || users[userIndex].role,
      isActive: isActive !== undefined ? isActive : users[userIndex].isActive,
      updatedAt: new Date().toISOString()
    };

    await writeData('users', users);

    const { password, ...userWithoutPassword } = users[userIndex];

    res.json({
      success: true,
      message: 'User updated successfully',
      user: userWithoutPassword
    });

  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete user (admin only)
app.delete('/api/users/:id', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const userId = parseInt(req.params.id);

    // Prevent admin from deleting themselves
    if (userId === req.user.id) {
      return res.status(400).json({ error: 'Cannot delete your own account' });
    }

    const users = await readData('users');
    const userIndex = users.findIndex(u => u.id === userId);

    if (userIndex === -1) {
      return res.status(404).json({ error: 'User not found' });
    }

    const deletedUser = users[userIndex];
    users.splice(userIndex, 1);

    await writeData('users', users);

    res.json({
      success: true,
      message: 'User deleted successfully',
      deletedUser: { id: deletedUser.id, email: deletedUser.email, name: deletedUser.name }
    });

  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create user (admin only)
app.post('/api/users', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const { name, email, password, role } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email and password are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    // Check if user exists
    const users = await readData('users');
    const existingUser = users.find(user => user.email === email);

    if (existingUser) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    // Create new user
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
      id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1,
      name,
      email,
      password: hashedPassword,
      role: role || 'student',
      isActive: true,
      createdAt: new Date().toISOString(),
      createdBy: req.user.id
    };

    users.push(newUser);
    await writeData('users', users);

    // Return user without password
    const { password: _, ...userWithoutPassword } = newUser;

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      user: userWithoutPassword
    });

  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get current user profile
app.get('/api/auth/profile', authenticateToken, async (req, res) => {
  try {
    const users = await readData('users');
    const user = users.find(u => u.id === req.user.id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const { password: _, ...userWithoutPassword } = user;

    res.json({
      success: true,
      user: userWithoutPassword
    });

  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Initialize default data for Vercel
const initializeVercelData = async () => {
  try {
    // Only initialize once per deployment
    if (global.memoryStorage.initialized) {
      console.log('✅ Data already initialized');
      return;
    }

    console.log('🔄 Initializing Vercel data...');

    // Check if users already exist
    const existingUsers = await readData('users');
    if (existingUsers.length === 0) {
      const defaultUsers = [
        {
          id: 1,
          email: "admin@aeck.com",
          password: await bcrypt.hash("admin123", 10),
          role: "admin",
          name: "Admin AECK",
          createdAt: new Date().toISOString(),
          isActive: true
        },
        {
          id: 2,
          email: "student1@gmail.com",
          password: await bcrypt.hash("123456", 10),
          role: "student",
          name: "Nguyễn Văn An",
          createdAt: new Date().toISOString(),
          isActive: true
        },
        {
          id: 3,
          email: "student2@gmail.com",
          password: await bcrypt.hash("123456", 10),
          role: "student",
          name: "Trần Thị Bình",
          createdAt: new Date().toISOString(),
          isActive: true
        }
      ];
      await writeData('users', defaultUsers);
      console.log('✅ Default users initialized for Vercel');
    } else {
      console.log('✅ Users already exist:', existingUsers.length, 'users');
    }

    // Initialize other data
    const existingExams = await readData('exams');
    if (existingExams.length === 0) {
      await writeData('exams', []);
    }

    const existingQuestions = await readData('questions');
    if (existingQuestions.length === 0) {
      await writeData('questions', []);
    }

    const existingResults = await readData('results');
    if (existingResults.length === 0) {
      await writeData('results', []);
    }

    // Mark as initialized
    global.memoryStorage.initialized = true;
    console.log('✅ Vercel data initialization complete');

  } catch (error) {
    console.error('❌ Error initializing Vercel data:', error);
  }
};

// Start server
const startServer = async () => {
  if (isVercel) {
    await initializeVercelData();
    console.log('🚀 AECK Server running on Vercel');
    console.log(`🌐 Storage mode: ${kv ? 'Vercel KV' : 'Memory'}`);
  } else {
    await initializeDataFiles();
    console.log(`🚀 AECK Server running on port ${PORT}`);
    console.log(`📁 Data directory: ${DATA_DIR}`);
    console.log(`🌐 Health check: http://localhost:${PORT}/api/health`);
  }
};

// For Vercel, we need to export the app
if (isVercel) {
  startServer();
  module.exports = app;
} else {
  startServer();
  app.listen(PORT);
}
