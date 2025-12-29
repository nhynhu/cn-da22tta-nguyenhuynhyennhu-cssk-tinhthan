const express = require('express');
const router = express.Router();
const emotionLogController = require('../controllers/emotionLogController');
const { protect } = require('../middlewares/authMiddleware');

// Tất cả API nhật ký cảm xúc yêu cầu đăng nhập
router.use(protect);

// POST /api/emotions - Lưu nhật ký mới cho user hiện tại (lấy từ token)
router.post('/', emotionLogController.createEmotionLog);

// GET /api/emotions - Lấy danh sách nhật ký của user hiện tại
router.get('/', emotionLogController.getEmotionLogs);

module.exports = router;
