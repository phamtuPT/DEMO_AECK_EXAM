#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 AECK System - Vercel Deployment Script');
console.log('==========================================');

// Check if vercel CLI is installed
try {
  execSync('vercel --version', { stdio: 'ignore' });
} catch (error) {
  console.log('❌ Vercel CLI not found. Installing...');
  execSync('npm install -g vercel', { stdio: 'inherit' });
}

// Function to deploy with retry
function deployWithRetry(command, description, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      console.log(`\n📦 ${description} (Attempt ${i + 1}/${maxRetries})`);
      execSync(command, { stdio: 'inherit' });
      console.log(`✅ ${description} successful!`);
      return true;
    } catch (error) {
      console.log(`❌ ${description} failed (Attempt ${i + 1}/${maxRetries})`);
      if (i === maxRetries - 1) {
        console.log(`💥 ${description} failed after ${maxRetries} attempts`);
        return false;
      }
      console.log('⏳ Retrying in 5 seconds...');
      execSync('sleep 5', { stdio: 'ignore' });
    }
  }
}

async function main() {
  try {
    // Step 1: Build frontend
    console.log('\n🔨 Building frontend...');
    execSync('npm run build', { stdio: 'inherit' });
    console.log('✅ Frontend build successful!');

    // Step 2: Deploy backend
    console.log('\n🚀 Deploying backend to Vercel...');
    process.chdir('server');
    
    if (!deployWithRetry('vercel --prod --yes', 'Backend deployment')) {
      process.exit(1);
    }

    // Step 3: Deploy frontend
    console.log('\n🚀 Deploying frontend to Vercel...');
    process.chdir('..');
    
    if (!deployWithRetry('vercel --prod --yes', 'Frontend deployment')) {
      process.exit(1);
    }

    // Step 4: Success message
    console.log('\n🎉 Deployment Complete!');
    console.log('========================');
    console.log('');
    console.log('📱 Frontend: https://aeck-exam-system.vercel.app');
    console.log('🔧 Backend:  https://aeck-server.vercel.app');
    console.log('🩺 Health:   https://aeck-server.vercel.app/api/health');
    console.log('');
    console.log('👥 Demo Accounts:');
    console.log('   Admin:   admin@aeck.com / admin123');
    console.log('   Student: student1@gmail.com / 123456');
    console.log('');
    console.log('🔄 Features:');
    console.log('   ✅ Cross-browser account access');
    console.log('   ✅ Real-time data synchronization');
    console.log('   ✅ Automatic server detection');
    console.log('   ✅ LocalStorage fallback');
    console.log('');
    console.log('🧪 Test the deployment:');
    console.log('   1. Visit the frontend URL');
    console.log('   2. Register a new account');
    console.log('   3. Open different browser');
    console.log('   4. Login with same account');
    console.log('   5. Verify cross-browser access works');

  } catch (error) {
    console.error('💥 Deployment failed:', error.message);
    process.exit(1);
  }
}

main();
