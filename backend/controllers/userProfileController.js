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