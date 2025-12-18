const express = require('express');
const router = express.Router();
const emotionLogController = require('../controllers/emotionLogController');

// POST /api/emotions - Lưu nhật ký mới
router.post('/', emotionLogController.createEmotionLog);

// GET /api/emotions?user_id=1 - Lấy danh sách nhật ký
router.get('/', emotionLogController.getEmotionLogs);

module.exports = router;
