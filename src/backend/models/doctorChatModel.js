const db = require('../config/db');
const { encrypt, decrypt } = require('../utils/encryption');

// Lưu trữ tin nhắn giữa user và chuyên gia
// Bảng: expert_chat_messages(user_id, expert_id, sender_type ENUM('user','expert'), message, created_at)

const DoctorChat = {
    // Gửi tin nhắn
    sendMessage: (userId, expertId, senderType, message) => {
        // Mã hóa tin nhắn trước khi lưu
        const encryptedMessage = encrypt(message);
        
        const sql = `INSERT INTO expert_chat_messages (user_id, expert_id, sender_type, message, created_at)
                     VALUES (?, ?, ?, ?, NOW())`;
        return new Promise((resolve, reject) => {
            db.query(sql, [userId, expertId, senderType, encryptedMessage], (err, result) => {
                if (err) return reject(err);
                resolve(result.insertId);
            });
        });
    },

    // Lấy toàn bộ hội thoại giữa 1 user và 1 chuyên gia
    getConversation: (userId, expertId) => {
        const sql = `SELECT * FROM expert_chat_messages
                     WHERE user_id = ? AND expert_id = ?
                     ORDER BY created_at ASC`;
        return new Promise((resolve, reject) => {
            db.query(sql, [userId, expertId], (err, rows) => {
                if (err) return reject(err);
                
                // Giải mã tin nhắn trước khi trả về
                const decryptedRows = rows.map(row => ({
                    ...row,
                    message: decrypt(row.message)
                }));
                
                resolve(decryptedRows);
            });
        });
    },

    // Danh sách user mà chuyên gia đã chat (truyền vào user_id của bác sĩ/chuyên gia)
    getDoctorPartners: (doctorUserId) => {
        const sql = `SELECT DISTINCT u.user_id AS id, u.full_name AS name, u.email
                     FROM expert_chat_messages m
                     JOIN users u ON m.user_id = u.user_id
                     JOIN experts e ON m.expert_id = e.expert_id
                     WHERE e.user_id = ?
                     ORDER BY name`;
        return new Promise((resolve, reject) => {
            db.query(sql, [doctorUserId], (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            });
        });
    },

    // Danh sách bác sĩ/chuyên gia mà user đã chat
    getUserDoctors: (userId) => {
        const sql = `SELECT DISTINCT du.user_id AS id, du.full_name AS name, du.email
                     FROM expert_chat_messages m
                     JOIN experts e ON m.expert_id = e.expert_id
                     JOIN users du ON e.user_id = du.user_id
                     WHERE m.user_id = ?
                     ORDER BY name`;
        return new Promise((resolve, reject) => {
            db.query(sql, [userId], (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            });
        });
    }
};

module.exports = DoctorChat;
