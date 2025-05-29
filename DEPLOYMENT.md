# 🚀 AECK System - Vercel Deployment Guide

## 📋 Deployment Overview

Hệ thống AECK được deploy trên Vercel với 2 projects:
- **Frontend**: React app (main project)
- **Backend**: Node.js API (separate project)

## 🔧 Setup Instructions

### 1. Deploy Backend (Server)

```bash
# Clone repository
git clone <your-repo>
cd server

# Deploy to Vercel
vercel --prod

# Set environment variables
vercel env add JWT_SECRET
# Enter: aeck-production-secret-key-2024-vercel

# Redeploy with env vars
vercel --prod
```

**Backend URL**: https://aeck-server.vercel.app

### 2. Deploy Frontend

```bash
# From root directory
vercel --prod

# Set environment variables
vercel env add REACT_APP_API_URL
# Enter: https://aeck-server.vercel.app/api
```

**Frontend URL**: https://aeck-exam-system.vercel.app

## 🌐 Production URLs

### Live Demo
- **Main App**: https://aeck-exam-system.vercel.app
- **API Server**: https://aeck-server.vercel.app/api/health

### Default Accounts
- **Admin**: admin@aeck.com / admin123
- **Student**: student1@gmail.com / 123456

## 🔄 Automatic Features

### 1. Server Auto-Detection
- Frontend tự động detect server availability
- Production mode ưu tiên server connection
- Fallback về localStorage nếu server down

### 2. Cross-Platform Storage
- **Server mode**: Dữ liệu lưu trên Vercel (memory/KV)
- **LocalStorage mode**: Fallback cho demo offline
- **Seamless switching**: Transparent cho user

### 3. Global Access
- **Multi-browser**: Cùng account trên nhiều browser
- **Multi-device**: Truy cập từ mobile, desktop
- **Real-time**: Dữ liệu sync ngay lập tức

## 📱 User Experience

### Registration Flow
1. User truy cập: https://aeck-exam-system.vercel.app
2. Click "Đăng ký tài khoản mới"
3. Điền thông tin → Submit
4. Account được lưu trên server
5. Auto login → Redirect to dashboard

### Cross-Platform Usage
1. Đăng ký trên Chrome → Account lưu server
2. Mở Firefox → Đăng nhập cùng account
3. Mở mobile → Cùng account hoạt động
4. Dữ liệu sync across all platforms

## 🔧 Technical Architecture

### Frontend (Vercel Static)
- **Framework**: React 18
- **Build**: Static files
- **CDN**: Global edge network
- **Auto-scaling**: Unlimited

### Backend (Vercel Serverless)
- **Runtime**: Node.js 18
- **Functions**: Serverless API
- **Storage**: Memory + optional KV
- **Auto-scaling**: On-demand

### Storage Strategy
```
Production Priority:
1. Vercel KV (if available)
2. Memory storage (Vercel)
3. LocalStorage (fallback)

Development:
1. Local file system
2. LocalStorage (fallback)
```

## 🛠️ Environment Variables

### Frontend (.env.production)
```
REACT_APP_API_URL=https://aeck-server.vercel.app/api
REACT_APP_ENV=production
GENERATE_SOURCEMAP=false
```

### Backend (Vercel)
```
NODE_ENV=production
JWT_SECRET=aeck-production-secret-key-2024-vercel
VERCEL=1
```

## 📊 Monitoring & Analytics

### Health Checks
- **API Health**: https://aeck-server.vercel.app/api/health
- **Frontend**: Auto-detect server availability
- **Status Display**: Real-time storage mode indicator

### Performance
- **Global CDN**: Fast loading worldwide
- **Serverless**: Auto-scaling
- **Caching**: Optimized static assets

## 🔒 Security Features

### Production Security
- **HTTPS**: Enforced on Vercel
- **CORS**: Configured for production domains
- **JWT**: Secure token authentication
- **Password Hashing**: bcrypt with salt

### Data Protection
- **No sensitive data**: In localStorage fallback
- **Server validation**: All inputs validated
- **Role-based access**: Admin/student permissions

## 🚀 Deployment Commands

### Quick Deploy
```bash
# Deploy both frontend and backend
npm run deploy:all

# Deploy frontend only
vercel --prod

# Deploy backend only
cd server && vercel --prod
```

### Update Environment
```bash
# Update API URL
vercel env add REACT_APP_API_URL

# Update JWT secret
cd server && vercel env add JWT_SECRET
```

## 🧪 Testing Production

### 1. Basic Functionality
- [ ] Homepage loads
- [ ] Registration works
- [ ] Login works
- [ ] Cross-browser access
- [ ] Mobile responsive

### 2. Storage Modes
- [ ] Server mode active (green tag)
- [ ] Account creation saves to server
- [ ] Cross-browser login works
- [ ] Fallback to localStorage if needed

### 3. Demo Flow
- [ ] Visit homepage
- [ ] Try demo accounts
- [ ] Register new account
- [ ] Take sample exam
- [ ] Check results

## 🎯 Benefits for Users

### Global Access
- ✅ **Any browser**: Chrome, Firefox, Safari, Edge
- ✅ **Any device**: Desktop, mobile, tablet
- ✅ **Any location**: Worldwide access
- ✅ **Real-time**: Instant data sync

### Reliability
- ✅ **99.9% uptime**: Vercel infrastructure
- ✅ **Auto-scaling**: Handle traffic spikes
- ✅ **Fallback mode**: Works even if server down
- ✅ **Fast loading**: Global CDN

### User-Friendly
- ✅ **No setup**: Just visit URL
- ✅ **Instant demo**: Try immediately
- ✅ **Persistent accounts**: Don't lose data
- ✅ **Professional**: Production-ready

## 📞 Support

### Issues & Bugs
- Check browser console for errors
- Verify network connectivity
- Try different browser
- Clear cache if needed

### Feature Requests
- Submit via GitHub issues
- Contact development team
- Suggest improvements

**🌐 Live Demo**: https://aeck-exam-system.vercel.app
**📧 Support**: Contact via demo page
