const db = require('../config/db');

const Suggestion = {
    // Lấy tất cả gợi ý của 1 user (thông qua emotion_logs)
    getByUserId: (userId) => {
        const sql = `
            SELECT s.*
            FROM suggestions s
            JOIN emotion_logs e ON s.log_id = e.log_id
            WHERE e.user_id = ?
            ORDER BY s.created_at DESC
        `;
        return new Promise((resolve, reject) => {
            db.query(sql, [userId], (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            });
        });
    },

    // Lấy gợi ý cho 1 log cụ thể, đảm bảo log thuộc về userId
    getByLogForUser: (logId, userId) => {
        const sql = `
            SELECT s.*
            FROM suggestions s
            JOIN emotion_logs e ON s.log_id = e.log_id
            WHERE s.log_id = ? AND e.user_id = ?
            ORDER BY s.created_at DESC
        `;
        return new Promise((resolve, reject) => {
            db.query(sql, [logId, userId], (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            });
        });
    },

    // Đánh dấu 1 gợi ý đã xem (chỉ nếu thuộc về userId)
    markViewedForUser: (suggestionId, userId) => {
        const sql = `
            UPDATE suggestions s
            JOIN emotion_logs e ON s.log_id = e.log_id
            SET s.is_viewed = 1
            WHERE s.suggestion_id = ? AND e.user_id = ?
        `;
        return new Promise((resolve, reject) => {
            db.query(sql, [suggestionId, userId], (err, result) => {
                if (err) return reject(err);
                resolve(result.affectedRows > 0);
            });
        });
    },

    // Tạo gợi ý mới cho 1 log (dùng cho admin/AI)
    create: (logId, suggestionType, title, content, priority = 'Medium') => {
        const sql = `
            INSERT INTO suggestions (log_id, suggestion_type, title, content, priority)
            VALUES (?, ?, ?, ?, ?)
        `;
        return new Promise((resolve, reject) => {
            db.query(sql, [logId, suggestionType, title, content, priority], (err, result) => {
                if (err) return reject(err);
                resolve(result.insertId);
            });
        });
    }
};

module.exports = Suggestion;
