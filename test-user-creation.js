#!/usr/bin/env node

// Test script to verify user creation functionality

const API_URL = 'http://localhost:5000/api';

async function testUserCreation() {
  console.log('🧪 Testing User Creation API');
  console.log('============================');

  try {
    // Step 1: Login as admin to get token
    console.log('\n1. 🔐 Admin Login');
    const loginResponse = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: 'admin@aeck.com',
        password: 'admin123'
      })
    });

    const loginData = await loginResponse.json();
    if (!loginData.success) {
      console.log('❌ Admin login failed:', loginData.error);
      return;
    }

    console.log('✅ Admin login successful');
    const token = loginData.token;

    // Step 2: Test user creation
    console.log('\n2. 👤 Creating Test User');
    const testUser = {
      name: 'Test User ' + Date.now(),
      email: `testuser${Date.now()}@example.com`,
      password: '123456',
      role: 'student',
      isActive: true
    };

    console.log('Creating user:', testUser);

    const createResponse = await fetch(`${API_URL}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(testUser)
    });

    const createData = await createResponse.json();
    console.log('Create response:', createData);

    if (createData.success) {
      console.log('✅ User created successfully');
      console.log('   ID:', createData.user.id);
      console.log('   Name:', createData.user.name);
      console.log('   Email:', createData.user.email);
      console.log('   Role:', createData.user.role);
    } else {
      console.log('❌ User creation failed:', createData.error);
    }

    // Step 3: Get all users to verify
    console.log('\n3. 📋 Getting All Users');
    const usersResponse = await fetch(`${API_URL}/users`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const usersData = await usersResponse.json();
    if (usersData.success) {
      console.log('✅ Users retrieved successfully');
      console.log('   Total users:', usersData.total);
      console.log('   Users:');
      usersData.users.forEach(user => {
        console.log(`     - ${user.name} (${user.email}) - ${user.role} - ${user.isActive ? 'Active' : 'Inactive'}`);
      });
    } else {
      console.log('❌ Failed to get users:', usersData.error);
    }

    // Step 4: Test user stats
    console.log('\n4. 📊 Getting User Stats');
    const statsResponse = await fetch(`${API_URL}/users/stats`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const statsData = await statsResponse.json();
    if (statsData.success) {
      console.log('✅ Stats retrieved successfully');
      console.log('   Total:', statsData.stats.total);
      console.log('   Active:', statsData.stats.active);
      console.log('   Students:', statsData.stats.students);
      console.log('   Admins:', statsData.stats.admins);
    } else {
      console.log('❌ Failed to get stats:', statsData.error);
    }

  } catch (error) {
    console.error('💥 Test failed:', error.message);
  }
}

// Check if fetch is available (Node.js 18+)
if (typeof fetch === 'undefined') {
  console.log('❌ This script requires Node.js 18+ with fetch support');
  process.exit(1);
}

testUserCreation();
