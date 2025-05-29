// Using built-in fetch (Node.js 18+)

const BASE_URL = 'http://localhost:5000/api';

async function testPasswordAPI() {
  console.log('🔒 Testing Password API');
  console.log('======================');

  try {
    // 1. Login as admin
    console.log('\n1. 🔐 Admin Login');
    const loginResponse = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'admin@aeck.com',
        password: 'admin123'
      })
    });

    const loginData = await loginResponse.json();
    console.log('Login response:', loginData);

    if (!loginData.success) {
      throw new Error('Admin login failed');
    }

    const token = loginData.token;
    console.log('✅ Admin login successful');

    // 2. Get all users to find a test user
    console.log('\n2. 📋 Getting Users');
    const usersResponse = await fetch(`${BASE_URL}/users`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const usersData = await usersResponse.json();
    console.log('Users response:', usersData);

    if (!usersData.success) {
      throw new Error('Failed to get users');
    }

    const testUser = usersData.users.find(u => u.role === 'student');
    if (!testUser) {
      throw new Error('No student user found for testing');
    }

    console.log(`✅ Found test user: ${testUser.name} (ID: ${testUser.id})`);

    // 3. Test password API
    console.log('\n3. 🔒 Testing Password API');
    const passwordResponse = await fetch(`${BASE_URL}/users/${testUser.id}/password`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const passwordData = await passwordResponse.json();
    console.log('Password response:', passwordData);

    if (passwordData.success) {
      console.log('✅ Password retrieved successfully');
      console.log(`   User: ${testUser.name}`);
      console.log(`   Password: ${passwordData.password}`);
    } else {
      console.log('❌ Password retrieval failed:', passwordData.error);
    }

    // 4. Test without token (should fail)
    console.log('\n4. 🚫 Testing Without Token');
    const noTokenResponse = await fetch(`${BASE_URL}/users/${testUser.id}/password`);
    const noTokenData = await noTokenResponse.json();
    console.log('No token response:', noTokenData);

    if (noTokenData.error) {
      console.log('✅ Correctly rejected request without token');
    } else {
      console.log('❌ Should have rejected request without token');
    }

    // 5. Test with invalid token (should fail)
    console.log('\n5. 🔒 Testing With Invalid Token');
    const invalidTokenResponse = await fetch(`${BASE_URL}/users/${testUser.id}/password`, {
      headers: {
        'Authorization': 'Bearer invalid-token'
      }
    });
    const invalidTokenData = await invalidTokenResponse.json();
    console.log('Invalid token response:', invalidTokenData);

    if (invalidTokenData.error) {
      console.log('✅ Correctly rejected request with invalid token');
    } else {
      console.log('❌ Should have rejected request with invalid token');
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }

  console.log('\n🎉 Password API test completed!');
}

testPasswordAPI();
