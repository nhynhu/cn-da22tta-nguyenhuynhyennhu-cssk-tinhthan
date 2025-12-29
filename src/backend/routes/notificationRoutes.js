const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const { protect } = require('../middlewares/authMiddleware');

// Tất cả API thông báo đều yêu cầu đăng nhập
router.use(protect);

// GET /api/notifications - Lấy danh sách thông báo
router.get('/', notificationController.getMyNotifications);

// GET /api/notifications/unread-count - Đếm số thông báo chưa đọc
router.get('/unread-count', notificationController.getUnreadCount);

// PATCH /api/notifications/:id/read - Đánh dấu một thông báo đã đọc
router.patch('/:id/read', notificationController.markNotificationAsRead);

// PATCH /api/notifications/read-all - Đánh dấu tất cả đã đọc
router.patch('/read-all', notificationController.markAllAsRead);

// DELETE /api/notifications/:id - Xóa một thông báo
router.delete('/:id', notificationController.deleteNotification);

// DELETE /api/notifications/read - Xóa tất cả thông báo đã đọc
router.delete('/read', notificationController.deleteReadNotifications);

module.exports = router;
