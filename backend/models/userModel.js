const db = require('../config/db');

const User = {
    // Tìm user bằng email
    findByEmail: async (email) => {
        const [rows] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
        return rows[0];
    },

    // Tạo user mới
    create: async (email, password, fullName) => {
        const [result] = await db.execute(
            'INSERT INTO users (email, password, full_name) VALUES (?, ?, ?)',
            [email, password, fullName]
        );
        return result;
    },

    // Tìm user bằng ID
    findById: async (id) => {
        const [rows] = await db.execute('SELECT user_id, email, full_name, created_at FROM users WHERE user_id = ?', [id]);
        return rows[0];
    }
};

module.exports = User;