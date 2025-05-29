# 🚀 AECK System - Hướng dẫn Deploy lên Vercel

## 📋 Tổng quan

Hệ thống AECK sẽ được deploy với 2 projects riêng biệt trên Vercel:
- **Frontend**: React app chính
- **Backend**: Node.js API server

## 🔧 Chuẩn bị Deploy

### 1. Cài đặt Vercel CLI
```bash
npm install -g vercel
```

### 2. Login Vercel
```bash
vercel login
```

## 🚀 Deploy Tự động (Khuyến nghị)

### Sử dụng script tự động:
```bash
npm run deploy:all
```

Script sẽ tự động:
1. Build frontend
2. Deploy backend lên Vercel
3. Deploy frontend lên Vercel
4. Hiển thị URLs và thông tin demo

## 🔧 Deploy Thủ công

### 1. Deploy Backend trước
```bash
cd server
vercel --prod

# Set environment variables
vercel env add JWT_SECRET
# Nhập: aeck-production-secret-key-2024-vercel

# Redeploy với env vars
vercel --prod
```

### 2. Deploy Frontend
```bash
cd ..
npm run build
vercel --prod

# Set environment variables (nếu cần)
vercel env add REACT_APP_API_URL
# Nhập: https://aeck-server.vercel.app/api
```

## 🌐 URLs Dự kiến

### Production URLs:
- **Frontend**: https://aeck-exam-system.vercel.app
- **Backend**: https://aeck-server.vercel.app
- **API Health**: https://aeck-server.vercel.app/api/health

## 🧪 Test Deployment

### 1. Kiểm tra cơ bản
- [ ] Frontend load được
- [ ] API health check OK
- [ ] Storage status hiển thị "Vercel Server"

### 2. Test tài khoản
- [ ] Đăng ký tài khoản mới
- [ ] Đăng nhập thành công
- [ ] Mở browser khác → đăng nhập cùng account
- [ ] Verify cross-browser access

### 3. Demo accounts
- [ ] Admin: admin@aeck.com / admin123
- [ ] Student: student1@gmail.com / 123456

## 🔄 Tính năng Cross-Platform

### ✅ Sau khi deploy thành công:

#### **Global Access**
- **Mọi browser**: Chrome, Firefox, Safari, Edge
- **Mọi thiết bị**: Desktop, mobile, tablet
- **Mọi nơi**: Truy cập từ bất kỳ đâu

#### **Real-time Sync**
- Đăng ký trên Chrome → Lưu server
- Mở Firefox → Đăng nhập cùng account
- Mở mobile → Cùng account hoạt động
- Data sync ngay lập tức

#### **Automatic Features**
- **Server detection**: Tự động detect Vercel server
- **Fallback mode**: LocalStorage nếu server down
- **Status display**: Real-time storage mode indicator

## 📊 Monitoring

### Health Checks
```bash
# Check API
curl https://aeck-server.vercel.app/api/health

# Check frontend
curl https://aeck-exam-system.vercel.app
```

### Logs
```bash
# View deployment logs
vercel logs

# View function logs
vercel logs --follow
```

## 🔧 Troubleshooting

### Common Issues:

#### 1. Build Errors
```bash
# Clear cache and rebuild
rm -rf node_modules package-lock.json
npm install
npm run build
```

#### 2. API Connection Issues
- Check CORS settings
- Verify API URL in environment
- Check network connectivity

#### 3. Storage Issues
- Check browser console for errors
- Verify server status
- Try different browser

### Debug Commands:
```bash
# Check environment
vercel env ls

# Check deployments
vercel ls

# Remove deployment
vercel rm <deployment-url>
```

## 🎯 Expected Results

### ✅ Successful Deployment:

#### **User Experience**
1. **Visit**: https://aeck-exam-system.vercel.app
2. **See**: "Lưu trữ: Vercel Server" (green tag)
3. **Register**: New account works
4. **Cross-browser**: Same account on different browsers
5. **Mobile**: Works on mobile devices

#### **Admin Features**
1. **Login**: admin@aeck.com / admin123
2. **Access**: Admin dashboard
3. **Manage**: Users, exams, questions
4. **Reports**: View exam results

#### **Student Features**
1. **Register**: Create new account
2. **Login**: Access dashboard
3. **Exams**: Take available exams
4. **Results**: View exam results
5. **Profile**: Update profile info

## 📞 Support

### If deployment fails:
1. Check Vercel dashboard for errors
2. Review build logs
3. Verify environment variables
4. Try manual deployment steps

### For demo purposes:
- Share frontend URL with users
- Provide demo account credentials
- Explain cross-browser features
- Show storage status indicator

## 🎉 Success Checklist

- [ ] Backend deployed successfully
- [ ] Frontend deployed successfully
- [ ] Health check returns OK
- [ ] Demo accounts work
- [ ] New registration works
- [ ] Cross-browser access works
- [ ] Mobile responsive
- [ ] Storage shows "Vercel Server"
- [ ] URLs shared with users

**🌐 Ready for global demo!**
