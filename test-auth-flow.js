#!/usr/bin/env node

// Test script to verify authentication flow

const API_URL = 'http://localhost:5000/api';

async function testAuthFlow() {
  console.log('🔐 Testing Authentication Flow');
  console.log('===============================');

  try {
    // Step 1: Test login
    console.log('\n1. 🔑 Admin Login Test');
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
    console.log('Login response:', loginData);

    if (!loginData.success) {
      console.log('❌ Login failed:', loginData.error);
      return;
    }

    console.log('✅ Login successful');
    console.log('   Token:', loginData.token ? 'Present' : 'Missing');
    console.log('   User:', loginData.user.name, '-', loginData.user.role);
    
    const token = loginData.token;

    // Step 2: Test token validation
    console.log('\n2. 🎫 Token Validation Test');
    const profileResponse = await fetch(`${API_URL}/auth/profile`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const profileData = await profileResponse.json();
    console.log('Profile response:', profileData);

    if (profileData.success) {
      console.log('✅ Token valid');
      console.log('   User ID:', profileData.user.id);
      console.log('   Role:', profileData.user.role);
    } else {
      console.log('❌ Token invalid:', profileData.error);
      return;
    }

    // Step 3: Test user creation with token
    console.log('\n3. 👤 User Creation with Token');
    const testUser = {
      name: 'Auth Test User ' + Date.now(),
      email: `authtest${Date.now()}@example.com`,
      password: '123456',
      role: 'student',
      isActive: true
    };

    console.log('Creating user:', testUser.name);

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
      console.log('✅ User created with authentication');
      console.log('   ID:', createData.user.id);
      console.log('   Name:', createData.user.name);
    } else {
      console.log('❌ User creation failed:', createData.error);
    }

    // Step 4: Test without token (should fail)
    console.log('\n4. 🚫 Test Without Token (Should Fail)');
    const noTokenResponse = await fetch(`${API_URL}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
        // No Authorization header
      },
      body: JSON.stringify({
        name: 'Should Fail',
        email: 'fail@example.com',
        password: '123456'
      })
    });

    const noTokenData = await noTokenResponse.json();
    console.log('No token response:', noTokenData);

    if (!noTokenData.success && noTokenData.error.includes('token')) {
      console.log('✅ Correctly rejected request without token');
    } else {
      console.log('❌ Security issue: Request without token was accepted');
    }

    // Step 5: Test with invalid token
    console.log('\n5. 🔒 Test With Invalid Token (Should Fail)');
    const invalidTokenResponse = await fetch(`${API_URL}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer invalid-token-12345'
      },
      body: JSON.stringify({
        name: 'Should Fail',
        email: 'fail2@example.com',
        password: '123456'
      })
    });

    const invalidTokenData = await invalidTokenResponse.json();
    console.log('Invalid token response:', invalidTokenData);

    if (!invalidTokenData.success && invalidTokenData.error.includes('token')) {
      console.log('✅ Correctly rejected request with invalid token');
    } else {
      console.log('❌ Security issue: Request with invalid token was accepted');
    }

    console.log('\n🎉 Authentication flow test completed!');

  } catch (error) {
    console.error('💥 Test failed:', error.message);
  }
}

// Check if fetch is available (Node.js 18+)
if (typeof fetch === 'undefined') {
  console.log('❌ This script requires Node.js 18+ with fetch support');
  process.exit(1);
}

testAuthFlow();
