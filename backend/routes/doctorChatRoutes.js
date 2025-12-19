const express = require('express');
const router = express.Router();
const doctorChatController = require('../controllers/doctorChatController');
const { protect } = require('../middlewares/authMiddleware');

// Tất cả API chat bác sĩ đều yêu cầu đăng nhập
router.use(protect);

// Danh sách đối tác hội thoại (bác sĩ <-> user)
router.get('/partners', doctorChatController.getPartners);

// Lấy hội thoại với 1 đối tác
router.get('/messages/:peerId', doctorChatController.getConversation);

// Gửi tin nhắn
router.post('/messages/:peerId', doctorChatController.sendMessage);

module.exports = router;
