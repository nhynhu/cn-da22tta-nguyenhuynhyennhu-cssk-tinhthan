const db = require('../config/db');

// Tạo thông báo mới
const createNotification = (userId, type, title, message, relatedId = null) => {
    const query = `
        INSERT INTO notifications (user_id, type, title, message, related_id)
        VALUES (?, ?, ?, ?, ?)
    `;
    return new Promise((resolve, reject) => {
        db.query(query, [userId, type, title, message, relatedId], (err, result) => {
            if (err) return reject(err);
            resolve(result.insertId);
        });
    });
};

// Lấy danh sách thông báo của user
const getNotificationsByUserId = (userId, limit = 50) => {
    const query = `
        SELECT * FROM notifications
        WHERE user_id = ?
        ORDER BY created_at DESC
        LIMIT ?
    `;
    return new Promise((resolve, reject) => {
        db.query(query, [userId, limit], (err, rows) => {
            if (err) return reject(err);
            resolve(rows);
        });
    });
};

// Đếm số thông báo chưa đọc
const countUnreadNotifications = (userId) => {
    const query = `
        SELECT COUNT(*) as unread_count
        FROM notifications
        WHERE user_id = ? AND is_read = 0
    `;
    return new Promise((resolve, reject) => {
        db.query(query, [userId], (err, rows) => {
            if (err) return reject(err);
            resolve(rows[0].unread_count);
        });
    });
};

// Đánh dấu thông báo đã đọc
const markAsRead = (notificationId, userId) => {
    const query = `
        UPDATE notifications
        SET is_read = 1
        WHERE notification_id = ? AND user_id = ?
    `;
    return new Promise((resolve, reject) => {
        db.query(query, [notificationId, userId], (err, result) => {
            if (err) return reject(err);
            resolve(result.affectedRows);
        });
    });
};

// Đánh dấu tất cả thông báo đã đọc
const markAllAsRead = (userId) => {
    const query = `
        UPDATE notifications
        SET is_read = 1
        WHERE user_id = ? AND is_read = 0
    `;
    return new Promise((resolve, reject) => {
        db.query(query, [userId], (err, result) => {
            if (err) return reject(err);
            resolve(result.affectedRows);
        });
    });
};

// Xóa thông báo
const deleteNotification = (notificationId, userId) => {
    const query = `
        DELETE FROM notifications
        WHERE notification_id = ? AND user_id = ?
    `;
    return new Promise((resolve, reject) => {
        db.query(query, [notificationId, userId], (err, result) => {
            if (err) return reject(err);
            resolve(result.affectedRows);
        });
    });
};

// Xóa tất cả thông báo đã đọc
const deleteReadNotifications = (userId) => {
    const query = `
        DELETE FROM notifications
        WHERE user_id = ? AND is_read = 1
    `;
    return new Promise((resolve, reject) => {
        db.query(query, [userId], (err, result) => {
            if (err) return reject(err);
            resolve(result.affectedRows);
        });
    });
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
