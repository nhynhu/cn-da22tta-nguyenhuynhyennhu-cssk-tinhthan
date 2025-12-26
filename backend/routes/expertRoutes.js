const express = require('express');
const router = express.Router();
const expertController = require('../controllers/expertController');
const { protect } = require('../middlewares/authMiddleware');

// Lấy toàn bộ danh sách chuyên gia
router.get('/', expertController.getExperts);

// Admin thêm chuyên gia mới
router.post('/', protect, expertController.createExpert);

// Admin xóa chuyên gia
router.delete('/:id', protect, expertController.deleteExpert);

module.exports = router;
