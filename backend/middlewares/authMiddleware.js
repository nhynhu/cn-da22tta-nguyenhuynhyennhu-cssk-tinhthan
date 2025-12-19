const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

// Xác thực JWT, gắn thông tin user vào req.user
exports.protect = async (req, res, next) => {
    try {
        let token = null;

        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
            token = req.headers.authorization.split(' ')[1];
        } else if (req.headers['x-auth-token']) {
            token = req.headers['x-auth-token'];
        }

        if (!token) {
            return res.status(401).json({ message: 'Không có token, từ chối truy cập.' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(401).json({ message: 'Người dùng không tồn tại.' });
        }

        req.user = {
            id: user.user_id,
            email: user.email,
            name: user.full_name,
            role: user.role || 'user'
        };

        next();
    } catch (error) {
        console.error('[AuthMiddleware] Error:', error.message);
        return res.status(401).json({ message: 'Token không hợp lệ.' });
    }
};

// Kiểm tra quyền theo role
exports.requireRole = (roles = []) => {
    const allowed = Array.isArray(roles) ? roles : [roles];

    return (req, res, next) => {
        if (!req.user || !allowed.includes(req.user.role)) {
            return res.status(403).json({ message: 'Bạn không có quyền truy cập chức năng này.' });
        }
        next();
    };
};
