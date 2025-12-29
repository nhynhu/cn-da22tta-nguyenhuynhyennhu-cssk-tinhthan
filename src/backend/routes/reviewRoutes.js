const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const { protect } = require('../middlewares/authMiddleware');

// Tất cả API đánh giá đều yêu cầu đăng nhập
router.use(protect);

// POST /api/reviews - Tạo hoặc cập nhật đánh giá
router.post('/', reviewController.createOrUpdateReview);

// GET /api/reviews/:target_type/:target_id - Lấy đánh giá của một target
router.get('/:target_type/:target_id', reviewController.getReviewsForTarget);

// GET /api/reviews/my/:target_type/:target_id - Lấy đánh giá của user hiện tại
router.get('/my/:target_type/:target_id', reviewController.getMyReviewForTarget);

// DELETE /api/reviews/:id - Xóa đánh giá
router.delete('/:id', reviewController.deleteReview);

module.exports = router;
