const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');

// Google OAuth Client - Client ID từ Google Cloud Console
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '123456789-xxxxxxxxxxxx.apps.googleusercontent.com';
const googleClient = new OAuth2Client(GOOGLE_CLIENT_ID);

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

// Đăng nhập/Đăng ký bằng Google
exports.googleLogin = async (req, res) => {
    try {
        const { credential } = req.body;

        if (!credential) {
            return res.status(400).json({ message: 'Thiếu thông tin xác thực Google.' });
        }

        // Xác thực token từ Google
        const ticket = await googleClient.verifyIdToken({
            idToken: credential,
            audience: GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        const { email, name, sub: googleId } = payload;

        console.log('[Google Login] Payload:', { email, name, googleId });

        // Kiểm tra user đã tồn tại chưa
        let user = await User.findByEmail(email);

        if (!user) {
            // Nếu chưa có, tạo tài khoản mới với mật khẩu ngẫu nhiên
            const randomPassword = Math.random().toString(36).slice(-12);
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(randomPassword, salt);

            await User.create(email, hashedPassword, name || email.split('@')[0], 'user');
            user = await User.findByEmail(email);
            console.log('[Google Login] Created new user:', email);
        }

        // Tạo token JWT
        const token = jwt.sign({ id: user.user_id }, process.env.JWT_SECRET, { expiresIn: '1d' });

        res.json({
            message: 'Đăng nhập Google thành công',
            token,
            user: { id: user.user_id, name: user.full_name, email: user.email, role: user.role }
        });
    } catch (error) {
        console.error('[Google Login] Error:', error);
        res.status(500).json({ message: 'Lỗi xác thực Google. Vui lòng thử lại.' });
    }
};

// Kiểm tra email có tồn tại không (cho chức năng quên mật khẩu)
exports.checkEmail = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: 'Vui lòng nhập email.' });
        }

        const user = await User.findByEmail(email);

        if (!user) {
            return res.status(404).json({ message: 'Email không tồn tại trong hệ thống.' });
        }

        res.json({ message: 'Email hợp lệ.', exists: true });
    } catch (error) {
        console.error('[Check Email] Error:', error);
        res.status(500).json({ message: 'Lỗi server.' });
    }
};

// Đặt lại mật khẩu
exports.resetPassword = async (req, res) => {
    try {
        const { email, newPassword } = req.body;

        if (!email || !newPassword) {
            return res.status(400).json({ message: 'Thiếu thông tin bắt buộc.' });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({ message: 'Mật khẩu phải có ít nhất 6 ký tự.' });
        }

        // Kiểm tra user có tồn tại không
        const user = await User.findByEmail(email);
        if (!user) {
            return res.status(404).json({ message: 'Email không tồn tại trong hệ thống.' });
        }

        // Mã hóa mật khẩu mới
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // Cập nhật mật khẩu
        await User.updatePassword(user.user_id, hashedPassword);

        console.log('[Reset Password] Success for:', email);
        res.json({ message: 'Đặt lại mật khẩu thành công!' });
    } catch (error) {
        console.error('[Reset Password] Error:', error);
        res.status(500).json({ message: 'Lỗi server.' });
    }
};

// ============ ADMIN FUNCTIONS ============

// Lấy tất cả người dùng (chỉ admin)
exports.getAllUsers = async (req, res) => {
    try {
        const currentUser = req.user;
        if (currentUser.role !== 'admin') {
            return res.status(403).json({ message: 'Chỉ admin mới có quyền xem danh sách người dùng.' });
        }

        const db = require('../config/db');
        const sql = 'SELECT user_id, full_name, email, role, created_at FROM users ORDER BY created_at DESC';

        db.query(sql, (err, rows) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: 'Lỗi server.' });
            }
            res.json({ data: rows });
        });
    } catch (error) {
        console.error('[Get All Users] Error:', error);
        res.status(500).json({ message: 'Lỗi server.' });
    }
};

// Admin tạo người dùng mới
exports.createUser = async (req, res) => {
    try {
        const currentUser = req.user;
        if (currentUser.role !== 'admin') {
            return res.status(403).json({ message: 'Chỉ admin mới có quyền tạo người dùng.' });
        }

        const { email, password, full_name, role } = req.body;

        if (!email || !password || !full_name) {
            return res.status(400).json({ message: 'Vui lòng nhập đầy đủ thông tin.' });
        }

        // Kiểm tra email đã tồn tại chưa
        const existingUser = await User.findByEmail(email);
        if (existingUser) {
            return res.status(400).json({ message: 'Email này đã được sử dụng.' });
        }

        // Mã hóa mật khẩu
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Tạo user
        const allowedRoles = ['user', 'expert', 'doctor', 'admin'];
        const userRole = role && allowedRoles.includes(role) ? role : 'user';

        const result = await User.create(email, hashedPassword, full_name, userRole);

        res.status(201).json({
            message: 'Tạo người dùng thành công!',
            data: { user_id: result.insertId }
        });
    } catch (error) {
        console.error('[Create User] Error:', error);
        res.status(500).json({ message: 'Lỗi server.' });
    }
};

// Admin cập nhật role người dùng
exports.updateUserRole = async (req, res) => {
    try {
        const currentUser = req.user;
        if (currentUser.role !== 'admin') {
            return res.status(403).json({ message: 'Chỉ admin mới có quyền cập nhật role.' });
        }

        const userId = parseInt(req.params.id, 10);
        const { role } = req.body;

        if (!userId || !role) {
            return res.status(400).json({ message: 'Thiếu thông tin cần thiết.' });
        }

        const allowedRoles = ['user', 'expert', 'doctor', 'admin'];
        if (!allowedRoles.includes(role)) {
            return res.status(400).json({ message: 'Role không hợp lệ.' });
        }

        const db = require('../config/db');
        const sql = 'UPDATE users SET role = ? WHERE user_id = ?';

        db.query(sql, [role, userId], (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: 'Lỗi server.' });
            }
            if (result.affectedRows === 0) {
                return res.status(404).json({ message: 'Không tìm thấy người dùng.' });
            }
            res.json({ message: 'Cập nhật role thành công!' });
        });
    } catch (error) {
        console.error('[Update User Role] Error:', error);
        res.status(500).json({ message: 'Lỗi server.' });
    }
};

// Admin xóa người dùng
exports.deleteUser = async (req, res) => {
    try {
        const currentUser = req.user;
        if (currentUser.role !== 'admin') {
            return res.status(403).json({ message: 'Chỉ admin mới có quyền xóa người dùng.' });
        }

        const userId = parseInt(req.params.id, 10);

        if (!userId) {
            return res.status(400).json({ message: 'Thiếu ID người dùng.' });
        }

        // Không cho xóa chính mình
        if (userId === currentUser.id) {
            return res.status(400).json({ message: 'Không thể xóa tài khoản của chính mình.' });
        }

        const db = require('../config/db');
        const sql = 'DELETE FROM users WHERE user_id = ?';

        db.query(sql, [userId], (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: 'Lỗi server.' });
            }
            if (result.affectedRows === 0) {
                return res.status(404).json({ message: 'Không tìm thấy người dùng.' });
            }
            res.json({ message: 'Xóa người dùng thành công!' });
        });
    } catch (error) {
        console.error('[Delete User] Error:', error);
        res.status(500).json({ message: 'Lỗi server.' });
    }
};