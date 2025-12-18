const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');

// GET /api/analytics/summary?user_id=1&days=30 - Tổng quan cảm xúc (pie chart)
router.get('/summary', analyticsController.getEmotionSummary);

// GET /api/analytics/trend?user_id=1&days=30 - Xu hướng cảm xúc (line chart)
router.get('/trend', analyticsController.getEmotionTrend);

// GET /api/analytics/combined?user_id=1&start_date=2025-01-01&end_date=2025-12-31 - Thống kê kết hợp
router.get('/combined', analyticsController.getCombinedStats);

// GET /api/analytics/emotion-logs?user_id=1 - Chỉ emotion_logs
router.get('/emotion-logs', analyticsController.getEmotionLogsStats);

// GET /api/analytics/chat-logs?user_id=1 - Chỉ chat_logs
router.get('/chat-logs', analyticsController.getChatLogsStats);

module.exports = router;
