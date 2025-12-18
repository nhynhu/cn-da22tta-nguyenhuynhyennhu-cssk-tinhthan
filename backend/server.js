const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const db = require('./config/db'); // Import kết nối DB bạn vừa tạo

// Cấu hình môi trường
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// --- MIDDLEWARES ---
app.use(cors()); // Cho phép Frontend (React) gọi API
app.use(express.json()); // Quan trọng: Để Server hiểu dữ liệu JSON từ Frontend gửi lên
app.use(express.urlencoded({ extended: true })); // Để đọc dữ liệu từ form

// --- TEST ROUTE ---
app.get('/', (req, res) => {
    res.send('Server Sức khỏe tinh thần đang chạy ổn định!');
});
const userRoutes = require('./routes/userRoutes');
const userProfileRoutes = require('./routes/userProfileRoutes');
const chatRoutes = require('./routes/chatRoutes');
const emotionLogRoutes = require('./routes/emotionLogRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');

// --- API ROUTES ---
app.use('/api/users', userRoutes);
app.use('/api/profiles', userProfileRoutes);
app.use('/api/chat', chatRoutes);           // API cho chat
app.use('/api/emotions', emotionLogRoutes); // API cho nhật ký
app.use('/api/analytics', analyticsRoutes); // API cho thống kê
// --- KHỞI CHẠY SERVER ---
app.listen(PORT, () => {
    console.log(`Server đang chạy tại: http://localhost:${PORT}`);
});