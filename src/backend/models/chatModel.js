const db = require('../config/db');

const Chat = {
    // --- CONVERSATION ---
    // Tạo cuộc hội thoại mới
    createConversation: async (userId, title) => {
        const [result] = await db.execute(
            'INSERT INTO conversations (user_id, title) VALUES (?, ?)',
            [userId, title]
        );
        return result.insertId; // Trả về ID cuộc hội thoại
    },

    // Lấy danh sách cuộc hội thoại của user
    getUserConversations: async (userId) => {
        const sql = `SELECT * FROM conversations WHERE user_id = ? ORDER BY started_at DESC`;
        const [rows] = await db.execute(sql, [userId]);
        return rows;
    },

    // --- MESSAGE ---
    // Lưu tin nhắn mới
    addMessage: async (conversationId, content, senderType, intent = null) => {
        const sql = `INSERT INTO messages (conversation_id, message_content, sender_type, dialogflow_intent) 
                     VALUES (?, ?, ?, ?)`;
        const [result] = await db.execute(sql, [conversationId, content, senderType, intent]);

        // Cập nhật thời gian tin nhắn cuối cùng cho cuộc hội thoại
        await db.execute(
            'UPDATE conversations SET last_message_at = NOW() WHERE conversation_id = ?',
            [conversationId]
        );

        return result;
    },

    // Lấy chi tiết tin nhắn của một cuộc hội thoại
    getMessages: async (conversationId) => {
        const sql = `SELECT * FROM messages WHERE conversation_id = ? ORDER BY sent_at ASC`;
        const [rows] = await db.execute(sql, [conversationId]);
        return rows;
    }
};

module.exports = Chat;