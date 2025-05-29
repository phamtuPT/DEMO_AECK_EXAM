// API Service for AECK System
const API_BASE_URL = process.env.REACT_APP_API_URL ||
  (process.env.NODE_ENV === 'production'
    ? 'https://aeck-server.vercel.app/api'
    : 'http://localhost:5000/api');

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Helper method to get auth headers
  getAuthHeaders() {
    const token = localStorage.getItem('authToken');
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    };
  }

  // Generic request method
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: this.getAuthHeaders(),
      ...options
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error(`API request failed: ${endpoint}`, error);
      throw error;
    }
  }

  // Auth methods
  async register(userData) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
  }

  async login(credentials) {
    const response = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    });

    // Store token if login successful
    if (response.success && response.token) {
      localStorage.setItem('authToken', response.token);
      localStorage.setItem('userInfo', JSON.stringify(response.user));
    }

    return response;
  }

  async getProfile() {
    return this.request('/auth/profile');
  }

  async logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userInfo');
    return { success: true };
  }

  // User methods
  async getUsers() {
    return this.request('/users');
  }

  // Health check
  async healthCheck() {
    return this.request('/health');
  }

  // Check if server is available
  async isServerAvailable() {
    try {
      await this.healthCheck();
      return true;
    } catch (error) {
      console.warn('Server not available, falling back to localStorage');
      return false;
    }
  }
}

// Create singleton instance
const apiService = new ApiService();

export default apiService;
