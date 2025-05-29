import React, { useState, useEffect } from 'react';
import { Card, Button, Typography, Space, Alert } from 'antd';

const { Text, Paragraph } = Typography;

const AuthDebug = () => {
  const [authInfo, setAuthInfo] = useState({});

  const checkAuth = () => {
    const token = localStorage.getItem('authToken');
    const userInfo = localStorage.getItem('userInfo');
    
    let parsedUser = null;
    try {
      parsedUser = userInfo ? JSON.parse(userInfo) : null;
    } catch (error) {
      console.error('Error parsing user info:', error);
    }

    setAuthInfo({
      hasToken: !!token,
      token: token ? `${token.substring(0, 20)}...` : 'None',
      hasUserInfo: !!userInfo,
      userInfo: parsedUser,
      timestamp: new Date().toLocaleString()
    });
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const testAPI = async () => {
    try {
      const token = localStorage.getItem('authToken');
      
      const response = await fetch('http://localhost:5000/api/users/stats', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();
      console.log('API Test Result:', data);
      
      if (data.success) {
        alert('✅ API call successful! Check console for details.');
      } else {
        alert('❌ API call failed: ' + data.error);
      }
    } catch (error) {
      console.error('API Test Error:', error);
      alert('💥 API test failed: ' + error.message);
    }
  };

  const clearAuth = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userInfo');
    checkAuth();
  };

  return (
    <Card title="🔐 Authentication Debug" style={{ margin: '20px', maxWidth: '600px' }}>
      <Space direction="vertical" style={{ width: '100%' }}>
        <Alert
          message="Debug Information"
          description="This component helps debug authentication issues"
          type="info"
          showIcon
        />
        
        <div>
          <Text strong>Token Status: </Text>
          <Text type={authInfo.hasToken ? 'success' : 'danger'}>
            {authInfo.hasToken ? '✅ Present' : '❌ Missing'}
          </Text>
        </div>
        
        <div>
          <Text strong>Token Preview: </Text>
          <Text code>{authInfo.token}</Text>
        </div>
        
        <div>
          <Text strong>User Info Status: </Text>
          <Text type={authInfo.hasUserInfo ? 'success' : 'danger'}>
            {authInfo.hasUserInfo ? '✅ Present' : '❌ Missing'}
          </Text>
        </div>
        
        {authInfo.userInfo && (
          <div>
            <Text strong>User Details:</Text>
            <Paragraph>
              <Text>Name: {authInfo.userInfo.name}</Text><br/>
              <Text>Email: {authInfo.userInfo.email}</Text><br/>
              <Text>Role: {authInfo.userInfo.role}</Text><br/>
              <Text>ID: {authInfo.userInfo.id}</Text>
            </Paragraph>
          </div>
        )}
        
        <div>
          <Text strong>Last Check: </Text>
          <Text>{authInfo.timestamp}</Text>
        </div>
        
        <Space>
          <Button onClick={checkAuth}>🔄 Refresh</Button>
          <Button onClick={testAPI} type="primary">🧪 Test API</Button>
          <Button onClick={clearAuth} danger>🗑️ Clear Auth</Button>
        </Space>
      </Space>
    </Card>
  );
};

export default AuthDebug;
