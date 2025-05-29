// Hybrid Storage Service - Uses server when available, localStorage as fallback
import apiService from './api';
import mockDatabase from '../data/mockDatabase';

class StorageService {
  constructor() {
    this.useServer = false;
    this.checkServerAvailability();
  }

  async checkServerAvailability() {
    try {
      this.useServer = await apiService.isServerAvailable();
      console.log(`🔄 Storage mode: ${this.useServer ? 'Server' : 'LocalStorage'}`);

      // In production, prefer server mode
      if (process.env.NODE_ENV === 'production' && !this.useServer) {
        console.log('🔄 Production mode: Retrying server connection...');
        // Retry once more in production
        setTimeout(async () => {
          this.useServer = await apiService.isServerAvailable();
          if (this.useServer) {
            console.log('🔄 Server connection restored in production');
          }
        }, 2000);
      }
    } catch (error) {
      this.useServer = false;
      console.log('🔄 Storage mode: LocalStorage (fallback)');
    }
  }

  // User authentication methods
  async register(userData) {
    if (this.useServer) {
      try {
        const response = await apiService.register(userData);
        return {
          success: true,
          user: response.user,
          message: 'Đăng ký thành công! (Lưu trên server)'
        };
      } catch (error) {
        console.error('Server registration failed, falling back to localStorage:', error);
        this.useServer = false;
      }
    }

    // Fallback to localStorage
    return this.registerLocalStorage(userData);
  }

  async login(credentials) {
    if (this.useServer) {
      try {
        const response = await apiService.login(credentials);
        return {
          success: true,
          user: response.user,
          message: 'Đăng nhập thành công! (Server)'
        };
      } catch (error) {
        if (error.message.includes('Invalid credentials')) {
          return {
            success: false,
            error: 'Email hoặc mật khẩu không đúng'
          };
        }
        console.error('Server login failed, falling back to localStorage:', error);
        this.useServer = false;
      }
    }

    // Fallback to localStorage
    return this.loginLocalStorage(credentials);
  }

  async logout() {
    if (this.useServer) {
      await apiService.logout();
    }

    // Always clear localStorage
    localStorage.removeItem('authToken');
    localStorage.removeItem('userInfo');
    localStorage.removeItem('userRole');

    return { success: true };
  }

  async getUsers() {
    if (this.useServer) {
      try {
        const response = await apiService.getUsers();
        return response.users;
      } catch (error) {
        console.error('Server getUsers failed, falling back to localStorage:', error);
        this.useServer = false;
      }
    }

    // Fallback to localStorage
    return mockDatabase.getUsers();
  }

  // LocalStorage fallback methods
  registerLocalStorage(userData) {
    try {
      const users = mockDatabase.getUsers();
      const existingUser = users.find(user => user.email === userData.email);

      if (existingUser) {
        return {
          success: false,
          error: 'Email này đã được sử dụng!'
        };
      }

      const newUser = {
        id: mockDatabase.getNextId('user'),
        name: userData.name,
        email: userData.email,
        password: userData.password, // In real app, this should be hashed
        role: 'student',
        isActive: true,
        createdAt: new Date().toISOString().split('T')[0]
      };

      users.push(newUser);
      mockDatabase.saveUsers(users);

      // Auto login
      localStorage.setItem('userInfo', JSON.stringify(newUser));
      localStorage.setItem('userRole', 'student');

      return {
        success: true,
        user: newUser,
        message: 'Đăng ký thành công! (LocalStorage)'
      };

    } catch (error) {
      return {
        success: false,
        error: 'Có lỗi xảy ra khi đăng ký!'
      };
    }
  }

  loginLocalStorage(credentials) {
    try {
      const users = mockDatabase.getUsers();
      const user = users.find(u =>
        u.email === credentials.email &&
        u.password === credentials.password &&
        u.isActive
      );

      if (!user) {
        return {
          success: false,
          error: 'Email hoặc mật khẩu không đúng'
        };
      }

      // Store user info
      localStorage.setItem('userInfo', JSON.stringify(user));
      localStorage.setItem('userRole', user.role);

      return {
        success: true,
        user: user,
        message: 'Đăng nhập thành công! (LocalStorage)'
      };

    } catch (error) {
      return {
        success: false,
        error: 'Có lỗi xảy ra khi đăng nhập!'
      };
    }
  }

  // Get current storage mode
  getStorageMode() {
    return this.useServer ? 'server' : 'localStorage';
  }

  // Force switch to localStorage mode
  forceLocalStorageMode() {
    this.useServer = false;
    console.log('🔄 Forced switch to LocalStorage mode');
  }

  // Try to reconnect to server
  async reconnectToServer() {
    await this.checkServerAvailability();
    return this.useServer;
  }
}

// Create singleton instance
const storageService = new StorageService();

export default storageService;
