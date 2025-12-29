# 🧠 Mental Health Care Platform
## Hệ Thống Chăm Sóc Sức Khỏe Tinh Thần

> **Version 3.0** - Cập nhật: 29/12/2025

[![Status](https://img.shields.io/badge/status-active-success.svg)]()
[![Platform](https://img.shields.io/badge/platform-web-blue.svg)]()
[![License](https://img.shields.io/badge/license-MIT-green.svg)]()

---

## 📋 Mục Lục

- [Giới Thiệu](#giới-thiệu)
- [Tính Năng](#tính-năng)
- [Công Nghệ](#công-nghệ)
- [Cài Đặt](#cài-đặt)
- [Sử Dụng](#sử-dụng)
- [Tài Liệu](#tài-liệu)
- [Đóng Góp](#đóng-góp)

---

## 🎯 Giới Thiệu

Nền tảng chăm sóc sức khỏe tinh thần toàn diện, cung cấp:
- 🤖 Chatbot AI hỗ trợ tâm lý
- 📝 Nhật ký cảm xúc với phân tích AI
- 🧘‍♂️ Bài tập thiền & thư giãn
- 👨‍⚕️ Tư vấn với chuyên gia
- 📊 Phân tích & thống kê sức khỏe

---

## ✨ Tính Năng

### Đã Hoàn Thành ✅

#### Core Features:
- ✅ **Đăng ký/Đăng nhập** - JWT Authentication
- ✅ **Chatbot AI** - Dialogflow + Emotion Analysis
- ✅ **Nhật ký cảm xúc** - Viết nhật ký + AI phân tích
- ✅ **Chat với bác sĩ** - Real-time messaging
- ✅ **Đặt lịch hẹn** - Booking system
- ✅ **Bài tập thiền** - Video/Audio exercises
- ✅ **Thống kê** - Analytics dashboard
- ✅ **Admin Panel** - Quản lý users, experts, exercises

#### Version 3.0 Features:
- ✅ **Password Reset** - Forgot/Reset password qua email
- ✅ **Exercise Tracking** - Theo dõi xem & hoàn thành bài tập
- ✅ **My Exercises** - Lịch sử và progress tracking
- ✅ **AI Integration** - Tích hợp AI service vào chat & diary
- ✅ **Notifications** - Hệ thống thông báo
- ✅ **Reviews** - Đánh giá chuyên gia & bài tập
- ✅ **Search & Filter** - Tìm kiếm nâng cao

### Roadmap 🚧
- 🔲 WebSocket cho real-time notifications
- 🔲 Video call integration
- 🔲 Payment gateway
- 🔲 Multi-language support
- 🔲 Mobile app

---

## 🛠 Công Nghệ

### Frontend
- **React.js** - UI framework
- **React Router** - Routing
- **Axios** - HTTP client
- **Bootstrap** - CSS framework

### Backend
- **Node.js** + **Express** - REST API
- **MySQL** - Database
- **JWT** - Authentication
- **Nodemailer** - Email service
- **Dialogflow** - Chatbot (optional)

### AI Service
- **Python** + **Flask** - AI API
- **Transformers** (Hugging Face) - Emotion analysis
- **Deep Translator** - Vietnamese → English

### DevOps
- **Docker** + **Docker Compose** - Containerization

---

## 📦 Cài Đặt

### Prerequisites
- Node.js >= 14
- MySQL >= 8.0
- Python >= 3.8
- Docker (optional)

### Quick Start

1. **Clone repository:**
```bash
git clone https://github.com/your-username/cn-da22tta-nguyenhuynhyennhu-cssk-tinhthan.git
cd cn-da22tta-nguyenhuynhyennhu-cssk-tinhthan
```

2. **Setup Database:**
```bash
mysql -u root -p
CREATE DATABASE mental_health_db;
USE mental_health_db;
source database/tinhthan.sql;
source database/migration_reset_token.sql;
```

3. **Backend Setup:**
```bash
cd backend
npm install
cp .env.example .env
# Edit .env với thông tin của bạn
node server.js
```

4. **Frontend Setup:**
```bash
cd frontend
npm install
npm start
```

5. **AI Service Setup:**
```bash
cd ai_service
pip install -r requirements.txt
python app.py
```

### Docker Setup

```bash
docker-compose up --build
```

---

## 🚀 Sử Dụng

### Truy cập ứng dụng:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5002
- **AI Service**: http://localhost:8000

### Tài khoản test:
```
Admin:
  Email: admin@gmail.com
  Password: 123456

Expert:
  Email: doctor_lan@gmail.com
  Password: 123456

User:
  Email: nhu_sinhvien@gmail.com
  Password: 123456
```

---

## 📚 Tài Liệu

- 📖 [FEATURES_UPDATE.md](FEATURES_UPDATE.md) - Chi tiết tất cả tính năng
- 🔧 [INSTALLATION_GUIDE.md](INSTALLATION_GUIDE.md) - Hướng dẫn cài đặt chi tiết
- 🎨 [FRONTEND_UPDATE.md](FRONTEND_UPDATE.md) - Cập nhật Frontend
- 📝 [SUMMARY.md](SUMMARY.md) - Tóm tắt Version 3.0
- 🤝 [copilot-instructions.md](.github/copilot-instructions.md) - AI Agent guidelines

### API Documentation

#### Authentication:
- `POST /api/users/register` - Đăng ký
- `POST /api/users/login` - Đăng nhập
- `POST /api/users/forgot-password` - Quên mật khẩu
- `POST /api/users/reset-password` - Đặt lại mật khẩu

#### Exercise Tracking:
- `POST /api/mind/exercises/:id/view` - Ghi nhận xem bài tập
- `POST /api/mind/exercises/:id/complete` - Đánh dấu hoàn thành
- `GET /api/mind/my-history` - Lịch sử xem
- `GET /api/mind/my-completed` - Bài tập đã hoàn thành
- `GET /api/mind/exercises/:id/stats` - Thống kê bài tập

Xem thêm trong [INSTALLATION_GUIDE.md](INSTALLATION_GUIDE.md)

---

## 🤝 Đóng Góp

Mọi đóng góp đều được chào đón! Vui lòng:

1. Fork repository
2. Tạo branch mới (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Tạo Pull Request

---

## 👥 Tác Giả

- **Nguyễn Huỳnh Yến Như** - *Developer* - [GitHub](https://github.com/your-username)

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 🙏 Acknowledgments

- Hugging Face - Emotion Analysis Model
- Dialogflow - Chatbot Framework
- Unsplash - Free Images

---

## 📞 Liên Hệ

- **Project**: [GitHub Repository](https://github.com/your-username/cn-da22tta-nguyenhuynhyennhu-cssk-tinhthan)

---

**⭐ Star this repo if you find it helpful!**
