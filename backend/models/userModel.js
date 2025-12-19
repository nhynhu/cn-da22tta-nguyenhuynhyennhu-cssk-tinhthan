const db = require('../config/db');

const User = {
    // Tìm user bằng email
    findByEmail: (email) => {
        return new Promise((resolve, reject) => {
            db.query('SELECT * FROM users WHERE email = ?', [email], (err, rows) => {
                if (err) return reject(err);
                resolve(rows[0]);
            });
        });
    },

    // Tạo user mới (mặc định role = 'user')
    create: (email, password, fullName, role = 'user') => {
        return new Promise((resolve, reject) => {
            db.query(
                'INSERT INTO users (email, password, full_name, role) VALUES (?, ?, ?, ?)',
                [email, password, fullName, role],
                (err, result) => {
                    if (err) return reject(err);
                    resolve(result);
                }
            );
        });
    },

    // Tìm user bằng ID
    findById: (id) => {
        return new Promise((resolve, reject) => {
            db.query('SELECT user_id, email, full_name, role, created_at FROM users WHERE user_id = ?', [id], (err, rows) => {
                if (err) return reject(err);
                resolve(rows[0]);
            });
        });
    }
};

module.exports = User;