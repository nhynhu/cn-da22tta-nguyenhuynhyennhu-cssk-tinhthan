const Expert = require('../models/expertModel');

// Lấy danh sách chuyên gia (bác sĩ / tư vấn viên) từ bảng experts
exports.getExperts = async (req, res) => {
    try {
        const experts = await Expert.getAll();
        return res.json({ data: experts });
    } catch (err) {
        console.error('[ExpertController] getExperts error:', err);
        return res.status(500).json({ message: 'Lỗi server khi lấy danh sách chuyên gia.' });
    }
};

// Thêm chuyên gia mới (chỉ admin)
exports.createExpert = async (req, res) => {
    try {
        const currentUser = req.user;
        if (currentUser.role !== 'admin') {
            return res.status(403).json({ message: 'Chỉ admin mới có quyền thêm chuyên gia.' });
        }

        const { user_id, specialization, qualification, experience_years, bio } = req.body;

        if (!user_id || !specialization) {
            return res.status(400).json({ message: 'Vui lòng chọn người dùng và nhập chuyên môn.' });
        }

        // Kiểm tra user đã là chuyên gia chưa
        const existingExpert = await Expert.getByUserId(user_id);
        if (existingExpert) {
            return res.status(400).json({ message: 'Người dùng này đã là chuyên gia.' });
        }

        // Cập nhật role của user thành 'expert'
        const db = require('../config/db');
        await new Promise((resolve, reject) => {
            db.query('UPDATE users SET role = ? WHERE user_id = ?', ['expert', user_id], (err, result) => {
                if (err) return reject(err);
                resolve(result);
            });
        });

        // Tạo bản ghi chuyên gia
        const expertId = await Expert.create(user_id, specialization, qualification, experience_years, bio);

        res.status(201).json({ message: 'Thêm chuyên gia thành công!', expert_id: expertId });
    } catch (err) {
        console.error('[ExpertController] createExpert error:', err);
        return res.status(500).json({ message: 'Lỗi server khi thêm chuyên gia.' });
    }
};

// Xóa chuyên gia (chỉ admin)
exports.deleteExpert = async (req, res) => {
    try {
        const currentUser = req.user;
        if (currentUser.role !== 'admin') {
            return res.status(403).json({ message: 'Chỉ admin mới có quyền xóa chuyên gia.' });
        }

        const expertId = parseInt(req.params.id, 10);
        if (!expertId) {
            return res.status(400).json({ message: 'Thiếu ID chuyên gia.' });
        }

        // Lấy thông tin chuyên gia để cập nhật role user
        const expert = await Expert.getById(expertId);
        if (!expert) {
            return res.status(404).json({ message: 'Không tìm thấy chuyên gia.' });
        }

        // Xóa chuyên gia
        await Expert.delete(expertId);

        // Cập nhật role của user về 'user'
        const db = require('../config/db');
        await new Promise((resolve, reject) => {
            db.query('UPDATE users SET role = ? WHERE user_id = ?', ['user', expert.user_id], (err, result) => {
                if (err) return reject(err);
                resolve(result);
            });
        });

        res.json({ message: 'Xóa chuyên gia thành công!' });
    } catch (err) {
        console.error('[ExpertController] deleteExpert error:', err);
        return res.status(500).json({ message: 'Lỗi server khi xóa chuyên gia.' });
    }
};
