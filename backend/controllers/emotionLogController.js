const db = require('../config/db');
const Diary = require('../models/emotionLogModel');
const axios = require('axios');

// Lưu nhật ký mới
exports.createEmotionLog = async (req, res) => {
    try {
        const { user_id, primary_emotion, user_note, log_date } = req.body;

        if (!user_note || user_note.trim() === '') {
            return res.status(400).json({ message: 'Vui lòng nhập nội dung nhật ký' });
        }

        // Gọi AI để phân tích cảm xúc (nếu có)
        let detectedEmotion = primary_emotion;
        let aiScore = 0;

        try {
            const py = await axios.post('http://localhost:8000/analyze-emotion', { text: user_note });
            detectedEmotion = py.data.top_emotion || primary_emotion || 'neutral';
            aiScore = py.data.score || 0;
        } catch (aiErr) {
            console.warn('AI service unavailable:', aiErr.message);
            detectedEmotion = primary_emotion || 'neutral';
        }

        const analysisData = JSON.stringify({ ai_detected: detectedEmotion, confidence: aiScore });

        const insertId = await Diary.createEntry(
            user_id || 0,
            detectedEmotion,
            user_note,
            log_date,
            analysisData,
            'manual'
        );

        res.status(201).json({
            message: 'Đã lưu nhật ký thành công',
            log_id: insertId,
            ai_analysis: { detected: detectedEmotion, score: aiScore }
        });

    } catch (error) {
        console.error('Lỗi lưu nhật ký:', error);
        res.status(500).json({ message: 'Lỗi server', error: String(error?.message || error) });
    }
};

// Lấy danh sách nhật ký theo user
exports.getEmotionLogs = async (req, res) => {
    try {
        const userId = req.query.user_id;

        if (!userId) {
            return res.status(400).json({ message: 'Thiếu user_id' });
        }

        const logs = await Diary.getEntriesByUser(userId, 100);
        res.status(200).json(logs);

    } catch (error) {
        console.error('Lỗi lấy nhật ký:', error);
        res.status(500).json({ message: 'Lỗi server', error: String(error?.message || error) });
    }
};
