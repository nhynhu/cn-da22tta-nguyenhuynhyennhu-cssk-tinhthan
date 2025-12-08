const db = require('../config/db');

const UserProfile = {
    // Lấy hồ sơ theo user_id
    getByUserId: async (userId) => {
        const [rows] = await db.execute('SELECT * FROM user_profiles WHERE user_id = ?', [userId]);
        return rows[0];
    },

    // Tạo mới hoặc cập nhật hồ sơ
    upsert: async (userId, data) => {
        // Kiểm tra xem đã có profile chưa
        const [existing] = await db.execute('SELECT profile_id FROM user_profiles WHERE user_id = ?', [userId]);

        if (existing.length > 0) {
            // Update
            const sql = `UPDATE user_profiles SET 
                         date_of_birth = ?, gender = ?, phone = ?, avatar_url = ? 
                         WHERE user_id = ?`;
            return db.execute(sql, [data.date_of_birth, data.gender, data.phone, data.avatar_url, userId]);
        } else {
            // Insert
            const sql = `INSERT INTO user_profiles (user_id, date_of_birth, gender, phone, avatar_url) 
                         VALUES (?, ?, ?, ?, ?)`;
            return db.execute(sql, [userId, data.date_of_birth, data.gender, data.phone, data.avatar_url]);
        }
    }
};

module.exports = UserProfile;