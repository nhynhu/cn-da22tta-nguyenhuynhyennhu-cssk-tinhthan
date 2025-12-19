const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Đăng ký
exports.register = async (req, res) => {
    try {
        const { email, password, full_name, role } = req.body;

        // 1. Kiểm tra email đã tồn tại chưa
        const existingUser = await User.findByEmail(email);
        if (existingUser) {
            return res.status(400).json({ message: 'Email này đã được sử dụng.' });
        }

        // 2. Mã hóa mật khẩu
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 3. Tạo user
        // Mặc định role = 'user' nếu không truyền từ client
        // Hệ thống dùng các role: 'user', 'expert', 'admin'
        const allowedRoles = ['user', 'expert', 'admin'];
        const userRole = role && allowedRoles.includes(role) ? role : 'user';

        await User.create(email, hashedPassword, full_name, userRole);

        res.status(201).json({ message: 'Đăng ký thành công!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi server.' });
    }
};

// Đăng nhập
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log('[Login] Attempt:', { email, hasPassword: !!password });

        if (!email || !password) {
            return res.status(400).json({ message: 'Thiếu email hoặc mật khẩu.' });
        }

        // 1. Kiểm tra user
        const user = await User.findByEmail(email);
        console.log('[Login] User found:', !!user);
        if (!user) {
            return res.status(400).json({ message: 'Email hoặc mật khẩu không đúng.' });
        }

        // 2. So sánh mật khẩu
        // Dữ liệu mẫu trong CSDL có thể lưu mật khẩu dạng plain (không băm),
        // trong khi tài khoản đăng ký mới dùng bcrypt. Hỗ trợ cả hai kiểu:
        let isMatch = false;
        if (user.password && user.password.startsWith('$2')) {
            // bcrypt hash
            isMatch = await bcrypt.compare(password, user.password);
        } else {
            // plain text (cho dữ liệu seed trong tinhthan.sql)
            isMatch = password === user.password;
        }
        if (!isMatch) {
            return res.status(400).json({ message: 'Email hoặc mật khẩu không đúng.' });
        }

        // 3. Tạo token JWT
        const token = jwt.sign({ id: user.user_id }, process.env.JWT_SECRET, { expiresIn: '1d' });

        res.json({
            message: 'Đăng nhập thành công',
            token,
            user: { id: user.user_id, name: user.full_name, email: user.email, role: user.role }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi server.' });
    }
};

// Lấy danh sách bác sĩ
exports.getDoctors = async (req, res) => {
    try {
        // Danh sách tài khoản chuyên gia (role = 'expert')
        const sql = 'SELECT user_id AS id, full_name AS name, email FROM users WHERE role = "expert"';
        const db = require('../config/db');

        db.query(sql, (err, rows) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: 'Lỗi server khi lấy danh sách bác sĩ.' });
            }
            res.json({ data: rows });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi server.' });
    }
};