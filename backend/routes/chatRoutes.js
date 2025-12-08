const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');

// API: POST http://localhost:5000/api/chat
router.post('/', chatController.sendMessageToBot);

module.exports = router;