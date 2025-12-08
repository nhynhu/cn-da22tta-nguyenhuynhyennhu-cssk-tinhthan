const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Đăng ký
exports.register = async (req, res) => {
    try {
        const { email, password, full_name } = req.body;

        // 1. Kiểm tra email đã tồn tại chưa
        const existingUser = await User.findByEmail(email);
        if (existingUser) {
            return res.status(400).json({ message: 'Email này đã được sử dụng.' });
        }

        // 2. Mã hóa mật khẩu
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 3. Tạo user
        await User.create(email, hashedPassword, full_name);

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

        // 1. Kiểm tra user
        const user = await User.findByEmail(email);
        if (!user) {
            return res.status(400).json({ message: 'Email hoặc mật khẩu không đúng.' });
        }

        // 2. So sánh mật khẩu
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Email hoặc mật khẩu không đúng.' });
        }

        // 3. Tạo token JWT
        const token = jwt.sign({ id: user.user_id }, process.env.JWT_SECRET, { expiresIn: '1d' });

        res.json({
            message: 'Đăng nhập thành công',
            token,
            user: { id: user.user_id, name: user.full_name, email: user.email }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi server.' });
    }
};