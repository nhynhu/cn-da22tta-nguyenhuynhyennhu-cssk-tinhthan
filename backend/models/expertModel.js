const db = require('../config/db');

const Expert = {
    getAll: () => {
        // Lấy thông tin chuyên gia kèm tên và email từ bảng users
        const sql = `
            SELECT 
                e.expert_id AS id,
                u.full_name AS name,
                u.email,
                e.specialization,
                e.avatar_url
            FROM experts e
            JOIN users u ON e.user_id = u.user_id
            ORDER BY u.full_name
        `;
        return new Promise((resolve, reject) => {
            db.query(sql, (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            });
        });
    },

    getById: (id) => {
        const sql = 'SELECT * FROM experts WHERE expert_id = ?';
        return new Promise((resolve, reject) => {
            db.query(sql, [id], (err, rows) => {
                if (err) return reject(err);
                resolve(rows[0] || null);
            });
        });
    },

    // Lấy thông tin chuyên gia theo user_id (tài khoản bác sĩ/chuyên gia trong bảng users)
    getByUserId: (userId) => {
        const sql = 'SELECT * FROM experts WHERE user_id = ?';
        return new Promise((resolve, reject) => {
            db.query(sql, [userId], (err, rows) => {
                if (err) return reject(err);
                resolve(rows[0] || null);
            });
        });
    },
};

module.exports = Expert;
