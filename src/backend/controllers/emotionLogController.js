const db = require('../config/db');
const Diary = require('../models/emotionLogModel');
const aiService = require('../services/aiService');

// Lưu nhật ký mới cho user đang đăng nhập (lấy từ req.user.id)
exports.createEmotionLog = async (req, res) => {
    try {
        const { primary_emotion, user_note, log_date } = req.body;

        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: 'Không xác định được người dùng.' });
        }

        if (!user_note || user_note.trim() === '') {
            return res.status(400).json({ message: 'Vui lòng nhập nội dung nhật ký' });
        }

        const userId = req.user.id;

        // Gọi AI để phân tích cảm xúc (nếu có)
        let detectedEmotion = primary_emotion;
        let aiScore = 0;

        const aiResult = await aiService.analyzeEmotion(user_note);
        if (aiResult.success) {
            detectedEmotion = aiResult.emotion || primary_emotion || 'neutral';
            aiScore = aiResult.score || 0;
        } else {
            console.warn('AI service unavailable, using manual emotion');
            detectedEmotion = primary_emotion || 'neutral';
        }

        const analysisData = JSON.stringify({
            ai_detected: detectedEmotion,
            confidence: aiScore,
            translated: aiResult.translated || ''
        });

        const insertId = await Diary.createEntry(
            userId,
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

// Lấy danh sách nhật ký của user đang đăng nhập
exports.getEmotionLogs = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: 'Không xác định được người dùng.' });
        }

        const userId = req.user.id;
        const logs = await Diary.getEntriesByUser(userId, 100);
        res.status(200).json(logs);

    } catch (error) {
        console.error('Lỗi lấy nhật ký:', error);
        res.status(500).json({ message: 'Lỗi server', error: String(error?.message || error) });
    }
};
