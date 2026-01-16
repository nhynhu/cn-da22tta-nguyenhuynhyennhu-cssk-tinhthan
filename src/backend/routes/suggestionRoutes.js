const express = require('express');
const router = express.Router();
const suggestionController = require('../controllers/suggestionController');
const { protect } = require('../middlewares/authMiddleware');

// GET /api/suggestions/categories - Lấy danh mục theo cảm xúc (yêu cầu đăng nhập)
router.get('/categories', protect, suggestionController.getCategoriesByEmotion);

// Mọi API gợi ý đều yêu cầu đăng nhập
router.use(protect);

// GET /api/suggestions - Lấy toàn bộ gợi ý của user hiện tại
router.get('/', suggestionController.getMySuggestions);

// GET /api/suggestions/log/:logId - Lấy gợi ý theo 1 nhật ký cảm xúc cụ thể
router.get('/log/:logId', suggestionController.getSuggestionsByLog);

// PATCH /api/suggestions/:id/viewed - Đánh dấu đã xem
router.patch('/:id/viewed', suggestionController.markViewed);

module.exports = router;
