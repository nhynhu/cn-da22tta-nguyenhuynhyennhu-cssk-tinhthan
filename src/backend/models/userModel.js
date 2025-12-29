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
    },

    // Cập nhật mật khẩu
    updatePassword: (userId, newPassword) => {
        return new Promise((resolve, reject) => {
            db.query(
                'UPDATE users SET password = ? WHERE user_id = ?',
                [newPassword, userId],
                (err, result) => {
                    if (err) return reject(err);
                    resolve(result);
                }
            );
        });
    },

    // Lưu reset token và thời gian hết hạn
    saveResetToken: (email, token, expiresAt) => {
        return new Promise((resolve, reject) => {
            db.query(
                'UPDATE users SET reset_token = ?, reset_token_expires = ? WHERE email = ?',
                [token, expiresAt, email],
                (err, result) => {
                    if (err) return reject(err);
                    resolve(result);
                }
            );
        });
    },

    // Tìm user bằng reset token
    findByResetToken: (token) => {
        return new Promise((resolve, reject) => {
            db.query(
                'SELECT * FROM users WHERE reset_token = ? AND reset_token_expires > NOW()',
                [token],
                (err, rows) => {
                    if (err) return reject(err);
                    resolve(rows[0]);
                }
            );
        });
    },

    // Xóa reset token sau khi sử dụng
    clearResetToken: (userId) => {
        return new Promise((resolve, reject) => {
            db.query(
                'UPDATE users SET reset_token = NULL, reset_token_expires = NULL WHERE user_id = ?',
                [userId],
                (err, result) => {
                    if (err) return reject(err);
                    resolve(result);
                }
            );
        });
    },

    // Cập nhật mật khẩu bằng email
    updatePasswordByEmail: (email, newPassword) => {
        return new Promise((resolve, reject) => {
            db.query(
                'UPDATE users SET password = ? WHERE email = ?',
                [newPassword, email],
                (err, result) => {
                    if (err) return reject(err);
                    resolve(result);
                }
            );
        });
    }
};

module.exports = User;