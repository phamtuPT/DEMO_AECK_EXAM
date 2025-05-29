# AECK Server - Backend cho hệ thống thi trực tuyến

## 🚀 Cài đặt và chạy server

### 1. Cài đặt dependencies
```bash
cd server
npm install
```

### 2. Chạy server
```bash
# Development mode (auto-restart)
npm run dev

# Production mode
npm start
```

Server sẽ chạy tại: http://localhost:5000

### 3. Kiểm tra server
Truy cập: http://localhost:5000/api/health

## 📁 Cấu trúc dữ liệu

Server sẽ tạo thư mục `data/` với các file:
- `users.json` - Danh sách người dùng
- `exams.json` - Danh sách đề thi
- `questions.json` - Ngân hàng câu hỏi
- `results.json` - Kết quả thi

## 🔐 API Endpoints

### Authentication
- `POST /api/auth/register` - Đăng ký tài khoản
- `POST /api/auth/login` - Đăng nhập
- `GET /api/auth/profile` - Lấy thông tin profile

### Users
- `GET /api/users` - Lấy danh sách user (admin only)

### Health Check
- `GET /api/health` - Kiểm tra trạng thái server

## 🔧 Environment Variables

Tạo file `.env` (optional):
```
PORT=5000
JWT_SECRET=your-secret-key
```

## 📝 Tài khoản mặc định

### Admin
- Email: admin@aeck.com
- Password: admin123

### Student
- Email: student1@gmail.com
- Password: 123456

## 🌐 Hybrid Storage

Hệ thống sử dụng hybrid storage:
- **Server mode**: Khi server available, dữ liệu lưu vào file
- **LocalStorage mode**: Khi server không available, fallback về localStorage

## 🔄 Cách hoạt động

1. Frontend tự động detect server availability
2. Nếu server online → sử dụng API
3. Nếu server offline → fallback về localStorage
4. User có thể manually reconnect server

## 📊 Lợi ích

### Server Mode:
- ✅ Dữ liệu persistent
- ✅ Chia sẻ giữa nhiều trình duyệt
- ✅ Bảo mật tốt hơn
- ✅ Backup dễ dàng

### LocalStorage Mode:
- ✅ Hoạt động offline
- ✅ Không cần setup server
- ✅ Demo nhanh chóng
- ✅ Fallback reliable

## 🛠️ Development

### Thêm API mới:
1. Thêm route trong `server.js`
2. Implement logic xử lý
3. Update `apiService.js` ở frontend
4. Update `storageService.js` cho fallback

### Testing:
```bash
# Test health check
curl http://localhost:5000/api/health

# Test register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"123456"}'
```

## 🔒 Security Notes

- Passwords được hash với bcrypt
- JWT tokens cho authentication
- CORS enabled cho development
- Input validation cho tất cả endpoints

## 📦 Production Deployment

1. Set environment variables
2. Use process manager (PM2)
3. Setup reverse proxy (nginx)
4. Enable HTTPS
5. Setup database backup

## 🐛 Troubleshooting

### Server không start:
- Kiểm tra port 5000 có bị chiếm không
- Kiểm tra permissions thư mục data/
- Xem logs trong console

### Frontend không connect:
- Kiểm tra CORS settings
- Verify API_BASE_URL
- Check network connectivity

### Data không sync:
- Restart server
- Clear browser cache
- Check file permissions
