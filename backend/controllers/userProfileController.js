const UserProfile = require('../models/userProfileModel');

// Lấy thông tin hồ sơ
exports.getProfile = async (req, res) => {
    try {
        const userId = req.params.userId; // Lấy từ URL
        const profile = await UserProfile.getByUserId(userId);

        if (!profile) {
            return res.status(404).json({ message: 'Chưa có hồ sơ' });
        }
        res.json(profile);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi lấy hồ sơ' });
    }
};

// Cập nhật hồ sơ
exports.updateProfile = async (req, res) => {
    try {
        const userId = req.params.userId;
        const { date_of_birth, gender, phone, avatar_url } = req.body;

        await UserProfile.upsert(userId, { date_of_birth, gender, phone, avatar_url });

        res.json({ message: 'Cập nhật hồ sơ thành công!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi cập nhật hồ sơ' });
    }
};

// Upload avatar
exports.uploadAvatar = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'Vui lòng chọn file ảnh' });
        }

        const userId = req.params.userId;
        const avatarUrl = `/uploads/avatars/${req.file.filename}`;

        // Cập nhật avatar_url trong profile
        await UserProfile.upsert(userId, { avatar_url: avatarUrl });

        res.json({
            message: 'Upload avatar thành công!',
            avatar_url: avatarUrl
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi upload avatar' });
    }
};