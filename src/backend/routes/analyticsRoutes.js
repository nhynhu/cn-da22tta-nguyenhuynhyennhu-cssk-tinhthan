const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');
const { protect } = require('../middlewares/authMiddleware');

// Tất cả API thống kê yêu cầu đăng nhập, dùng user từ token
router.use(protect);

// GET /api/analytics/summary?days=30 - Tổng quan cảm xúc (pie chart) cho user hiện tại
router.get('/summary', analyticsController.getEmotionSummary);

// GET /api/analytics/trend?days=30 - Xu hướng cảm xúc (line chart) cho user hiện tại
router.get('/trend', analyticsController.getEmotionTrend);

// GET /api/analytics/combined?start_date=YYYY-MM-DD&end_date=YYYY-MM-DD - Thống kê kết hợp
router.get('/combined', analyticsController.getCombinedStats);

// GET /api/analytics/emotion-logs?start_date=...&end_date=... - Chỉ emotion_logs
router.get('/emotion-logs', analyticsController.getEmotionLogsStats);

// GET /api/analytics/chat-logs?start_date=...&end_date=... - Chỉ chat_logs
router.get('/chat-logs', analyticsController.getChatLogsStats);

module.exports = router;
