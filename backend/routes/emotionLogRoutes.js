const express = require('express');
const router = express.Router();
const emotionLogController = require('../controllers/emotionLogController.js');

router.post('/', emotionLogController.createLog);       // Tạo nhật ký mới
router.get('/:userId', emotionLogController.getHistory); // Xem lịch sử

module.exports = router;