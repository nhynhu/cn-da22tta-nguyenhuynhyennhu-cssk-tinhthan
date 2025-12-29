const db = require('../config/db');

// Tạo thông báo mới
const createNotification = async (userId, type, title, message, relatedId = null) => {
    const query = `
        INSERT INTO notifications (user_id, type, title, message, related_id)
        VALUES (?, ?, ?, ?, ?)
    `;
    const [result] = await db.query(query, [userId, type, title, message, relatedId]);
    return result.insertId;
};

// Lấy danh sách thông báo của user
const getNotificationsByUserId = async (userId, limit = 50) => {
    const query = `
        SELECT * FROM notifications
        WHERE user_id = ?
        ORDER BY created_at DESC
        LIMIT ?
    `;
    const [rows] = await db.query(query, [userId, limit]);
    return rows;
};

// Đếm số thông báo chưa đọc
const countUnreadNotifications = async (userId) => {
    const query = `
        SELECT COUNT(*) as unread_count
        FROM notifications
        WHERE user_id = ? AND is_read = 0
    `;
    const [rows] = await db.query(query, [userId]);
    return rows[0].unread_count;
};

// Đánh dấu thông báo đã đọc
const markAsRead = async (notificationId, userId) => {
    const query = `
        UPDATE notifications
        SET is_read = 1
        WHERE notification_id = ? AND user_id = ?
    `;
    const [result] = await db.query(query, [notificationId, userId]);
    return result.affectedRows;
};

// Đánh dấu tất cả thông báo đã đọc
const markAllAsRead = async (userId) => {
    const query = `
        UPDATE notifications
        SET is_read = 1
        WHERE user_id = ? AND is_read = 0
    `;
    const [result] = await db.query(query, [userId]);
    return result.affectedRows;
};

// Xóa thông báo
const deleteNotification = async (notificationId, userId) => {
    const query = `
        DELETE FROM notifications
        WHERE notification_id = ? AND user_id = ?
    `;
    const [result] = await db.query(query, [notificationId, userId]);
    return result.affectedRows;
};

// Xóa tất cả thông báo đã đọc
const deleteReadNotifications = async (userId) => {
    const query = `
        DELETE FROM notifications
        WHERE user_id = ? AND is_read = 1
    `;
    const [result] = await db.query(query, [userId]);
    return result.affectedRows;
};

module.exports = {
    createNotification,
    getNotificationsByUserId,
    countUnreadNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    deleteReadNotifications
};
