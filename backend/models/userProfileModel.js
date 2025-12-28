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
        const [existing] = await db.execute('SELECT * FROM user_profiles WHERE user_id = ?', [userId]);

        if (existing.length > 0) {
            // Update - chỉ cập nhật các trường được gửi lên
            const currentProfile = existing[0];
            const updatedData = {
                date_of_birth: data.date_of_birth !== undefined ? data.date_of_birth : currentProfile.date_of_birth,
                gender: data.gender !== undefined ? data.gender : currentProfile.gender,
                phone: data.phone !== undefined ? data.phone : currentProfile.phone,
                avatar_url: data.avatar_url !== undefined ? data.avatar_url : currentProfile.avatar_url
            };

            const sql = `UPDATE user_profiles SET 
                         date_of_birth = ?, gender = ?, phone = ?, avatar_url = ? 
                         WHERE user_id = ?`;
            return db.execute(sql, [updatedData.date_of_birth, updatedData.gender, updatedData.phone, updatedData.avatar_url, userId]);
        } else {
            // Insert
            const sql = `INSERT INTO user_profiles (user_id, date_of_birth, gender, phone, avatar_url) 
                         VALUES (?, ?, ?, ?, ?)`;
            return db.execute(sql, [userId, data.date_of_birth || null, data.gender || null, data.phone || null, data.avatar_url || null]);
        }
    }
};

module.exports = UserProfile;