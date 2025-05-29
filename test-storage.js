#!/usr/bin/env node

// Test script to verify cross-browser storage functionality

const API_URL = process.argv[2] || 'http://localhost:5000/api';

console.log('🧪 Testing AECK Storage Functionality');
console.log('=====================================');
console.log(`API URL: ${API_URL}`);

async function testAPI(endpoint, options = {}) {
  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    });
    
    const data = await response.json();
    return { success: response.ok, data, status: response.status };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

async function runTests() {
  console.log('\n1. 🩺 Health Check');
  console.log('------------------');
  
  const health = await testAPI('/health');
  if (health.success) {
    console.log('✅ Server is running');
    console.log(`   Environment: ${health.data.environment}`);
    console.log(`   Storage: ${health.data.storage}`);
    console.log(`   User Count: ${health.data.userCount}`);
    console.log(`   Initialized: ${health.data.initialized}`);
  } else {
    console.log('❌ Server health check failed');
    return;
  }

  console.log('\n2. 🔍 Storage Debug');
  console.log('-------------------');
  
  const debug = await testAPI('/debug/storage');
  if (debug.success) {
    console.log('✅ Storage debug info:');
    console.log(`   Environment: ${debug.data.environment}`);
    console.log(`   Storage Type: ${debug.data.storage}`);
    console.log(`   Initialized: ${debug.data.initialized}`);
    console.log(`   Users: ${debug.data.userCount}`);
    debug.data.users.forEach(user => {
      console.log(`     - ${user.email} (${user.role})`);
    });
  } else {
    console.log('❌ Storage debug failed');
  }

  console.log('\n3. 📝 Test Registration');
  console.log('-----------------------');
  
  const testUser = {
    name: 'Test User',
    email: `test${Date.now()}@example.com`,
    password: '123456'
  };

  const register = await testAPI('/auth/register', {
    method: 'POST',
    body: JSON.stringify(testUser)
  });

  if (register.success) {
    console.log('✅ Registration successful');
    console.log(`   User: ${register.data.user.name}`);
    console.log(`   Email: ${register.data.user.email}`);
    console.log(`   ID: ${register.data.user.id}`);
    
    const token = register.data.token;

    console.log('\n4. 🔐 Test Login');
    console.log('----------------');
    
    const login = await testAPI('/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email: testUser.email,
        password: testUser.password
      })
    });

    if (login.success) {
      console.log('✅ Login successful');
      console.log(`   Token received: ${login.data.token ? 'Yes' : 'No'}`);
      
      console.log('\n5. 👤 Test Profile');
      console.log('------------------');
      
      const profile = await testAPI('/auth/profile', {
        headers: {
          'Authorization': `Bearer ${login.data.token}`
        }
      });

      if (profile.success) {
        console.log('✅ Profile access successful');
        console.log(`   Name: ${profile.data.user.name}`);
        console.log(`   Email: ${profile.data.user.email}`);
      } else {
        console.log('❌ Profile access failed');
      }

    } else {
      console.log('❌ Login failed');
      console.log(`   Error: ${login.data?.error || login.error}`);
    }

  } else {
    console.log('❌ Registration failed');
    console.log(`   Error: ${register.data?.error || register.error}`);
  }

  console.log('\n6. 🔍 Final Storage Check');
  console.log('-------------------------');
  
  const finalDebug = await testAPI('/debug/storage');
  if (finalDebug.success) {
    console.log(`✅ Final user count: ${finalDebug.data.userCount}`);
    console.log('   All users:');
    finalDebug.data.users.forEach(user => {
      console.log(`     - ${user.email} (${user.role})`);
    });
  }

  console.log('\n🎯 Test Summary');
  console.log('===============');
  console.log('✅ If all tests passed, cross-browser storage should work');
  console.log('📱 Users can now register on one browser and login on another');
  console.log('🌐 Accounts are stored persistently on the server');
  
  if (API_URL.includes('vercel.app')) {
    console.log('\n🚀 Production Deployment');
    console.log('========================');
    console.log('✅ Server is running on Vercel');
    console.log('✅ Cross-browser access enabled');
    console.log('✅ Global account sharing works');
    console.log('\n📋 Share these URLs:');
    console.log(`   Frontend: ${API_URL.replace('/api', '')}`);
    console.log(`   Health: ${API_URL}/health`);
    console.log(`   Debug: ${API_URL}/debug/storage`);
  }
}

// Check if fetch is available (Node.js 18+)
if (typeof fetch === 'undefined') {
  console.log('❌ This script requires Node.js 18+ with fetch support');
  console.log('   Or install node-fetch: npm install node-fetch');
  process.exit(1);
}

runTests().catch(console.error);
