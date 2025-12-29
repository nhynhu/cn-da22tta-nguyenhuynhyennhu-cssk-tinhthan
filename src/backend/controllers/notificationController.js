const notificationModel = require('../models/notificationModel');

// Lấy danh sách thông báo của user hiện tại
const getMyNotifications = async (req, res) => {
    try {
        const userId = req.user.user_id;
        const limit = parseInt(req.query.limit) || 50;

        const notifications = await notificationModel.getNotificationsByUserId(userId, limit);
        const unreadCount = await notificationModel.countUnreadNotifications(userId);

        res.json({
            success: true,
            notifications,
            unreadCount
        });
    } catch (error) {
        console.error('Lỗi khi lấy thông báo:', error);
        res.status(500).json({ message: 'Lỗi server khi lấy thông báo' });
    }
};

// Đếm số thông báo chưa đọc
const getUnreadCount = async (req, res) => {
    try {
        const userId = req.user.user_id;
        const unreadCount = await notificationModel.countUnreadNotifications(userId);

        res.json({
            success: true,
            unreadCount
        });
    } catch (error) {
        console.error('Lỗi khi đếm thông báo chưa đọc:', error);
        res.status(500).json({ message: 'Lỗi server' });
    }
};

// Đánh dấu một thông báo đã đọc
const markNotificationAsRead = async (req, res) => {
    try {
        const userId = req.user.user_id;
        const { id } = req.params;

        const affectedRows = await notificationModel.markAsRead(id, userId);

        if (affectedRows === 0) {
            return res.status(404).json({ message: 'Không tìm thấy thông báo' });
        }

        res.json({
            success: true,
            message: 'Đã đánh dấu đã đọc'
        });
    } catch (error) {
        console.error('Lỗi khi đánh dấu thông báo:', error);
        res.status(500).json({ message: 'Lỗi server' });
    }
};

// Đánh dấu tất cả thông báo đã đọc
const markAllAsRead = async (req, res) => {
    try {
        const userId = req.user.user_id;
        const affectedRows = await notificationModel.markAllAsRead(userId);

        res.json({
            success: true,
            message: `Đã đánh dấu ${affectedRows} thông báo là đã đọc`
        });
    } catch (error) {
        console.error('Lỗi khi đánh dấu tất cả thông báo:', error);
        res.status(500).json({ message: 'Lỗi server' });
    }
};

// Xóa một thông báo
const deleteNotification = async (req, res) => {
    try {
        const userId = req.user.user_id;
        const { id } = req.params;

        const affectedRows = await notificationModel.deleteNotification(id, userId);

        if (affectedRows === 0) {
            return res.status(404).json({ message: 'Không tìm thấy thông báo' });
        }

        res.json({
            success: true,
            message: 'Đã xóa thông báo'
        });
    } catch (error) {
        console.error('Lỗi khi xóa thông báo:', error);
        res.status(500).json({ message: 'Lỗi server' });
    }
};

// Xóa tất cả thông báo đã đọc
const deleteReadNotifications = async (req, res) => {
    try {
        const userId = req.user.user_id;
        const affectedRows = await notificationModel.deleteReadNotifications(userId);

        res.json({
            success: true,
            message: `Đã xóa ${affectedRows} thông báo`
        });
    } catch (error) {
        console.error('Lỗi khi xóa thông báo đã đọc:', error);
        res.status(500).json({ message: 'Lỗi server' });
    }
};

module.exports = {
    getMyNotifications,
    getUnreadCount,
    markNotificationAsRead,
    markAllAsRead,
    deleteNotification,
    deleteReadNotifications
};
