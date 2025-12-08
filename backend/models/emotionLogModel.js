const db = require('../config/db');

const EmotionLog = {
    // Thêm nhật ký mới (người dùng tự nhập hoặc từ AI)
    create: async (data) => {
        const sql = `INSERT INTO emotion_logs (user_id, log_date, source_type, primary_emotion, user_note, analysis) 
                     VALUES (?, ?, ?, ?, ?, ?)`;
        const [result] = await db.execute(sql, [
            data.user_id,
            data.log_date,
            data.source_type, // 'manual' hoặc 'chat_analysis'
            data.primary_emotion,
            data.user_note,
            data.analysis // Có thể là JSON string
        ]);
        return result;
    },

    // Lấy lịch sử cảm xúc của user (để vẽ biểu đồ)
    getByUserId: async (userId) => {
        const sql = `SELECT * FROM emotion_logs WHERE user_id = ? ORDER BY log_date DESC, created_at DESC`;
        const [rows] = await db.execute(sql, [userId]);
        return rows;
    }
};

module.exports = EmotionLog;