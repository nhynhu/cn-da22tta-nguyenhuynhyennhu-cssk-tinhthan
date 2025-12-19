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
