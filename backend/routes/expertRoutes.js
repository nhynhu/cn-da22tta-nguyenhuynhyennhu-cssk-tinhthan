const express = require('express');
const router = express.Router();
const expertController = require('../controllers/expertController');

// Lấy toàn bộ danh sách chuyên gia
router.get('/', expertController.getExperts);

module.exports = router;
