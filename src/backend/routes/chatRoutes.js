const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');

// API: POST http://localhost:5000/api/chat
router.post('/', chatController.sendMessageToBot);

// API: GET http://localhost:5000/api/chat/history/:userId
router.get('/history/:userId', chatController.getChatHistory);

// API: GET http://localhost:5000/api/chat/stats/:userId
router.get('/stats/:userId', chatController.getEmotionStats);

module.exports = router;