const db = require('../config/db');

const Diary = {
    // Tạo một mục nhật ký
    createEntry: (userId, primary_emotion, user_note, log_date = null, analysis = null, source_type = 'manual') => {
        return new Promise((resolve, reject) => {
            // Format date cho MySQL: YYYY-MM-DD HH:mm:ss
            let finalDate = log_date;
            if (!finalDate) {
                finalDate = new Date();
            }

            // Convert sang Date object nếu là string
            if (typeof finalDate === 'string') {
                finalDate = new Date(finalDate);
            }

            // Format thành MySQL datetime
            if (finalDate instanceof Date) {
                finalDate = finalDate.toISOString().slice(0, 19).replace('T', ' ');
            }

            const sql = `
                INSERT INTO emotion_logs (user_id, log_date, source_type, primary_emotion, user_note, analysis, created_at)
                VALUES (?, ?, ?, ?, ?, ?, NOW())
            `;
            db.query(sql, [userId || 0, finalDate, source_type, primary_emotion, user_note, analysis], (err, result) => {
                if (err) return reject(err);
                resolve(result.insertId);
            });
        });
    },

    // Lấy danh sách nhật ký theo user_id
    getEntriesByUser: (userId, limit = 100) => {
        return new Promise((resolve, reject) => {
            const sql = `SELECT * FROM emotion_logs WHERE user_id = ? ORDER BY log_date DESC, created_at DESC LIMIT ?`;
            db.query(sql, [userId, limit], (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            });
        });
    }
};

module.exports = Diary;
