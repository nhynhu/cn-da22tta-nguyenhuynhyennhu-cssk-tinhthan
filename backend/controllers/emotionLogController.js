const EmotionLog = require('../models/emotionLogModel');

exports.createLog = async (req, res) => {
    try {
        const { user_id, log_date, source_type, primary_emotion, user_note, analysis } = req.body;

        // Validate dữ liệu cơ bản
        if (!user_id || !primary_emotion) {
            return res.status(400).json({ message: 'Thiếu thông tin bắt buộc' });
        }

        await EmotionLog.create({
            user_id,
            log_date: log_date || new Date(),
            source_type: source_type || 'manual',
            primary_emotion,
            user_note,
            analysis
        });

        res.status(201).json({ message: 'Đã lưu nhật ký cảm xúc' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi server' });
    }
};

exports.getHistory = async (req, res) => {
    try {
        const logs = await EmotionLog.getByUserId(req.params.userId);
        res.json(logs);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi lấy dữ liệu' });
    }
};