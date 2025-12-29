const express = require('express');
const router = express.Router();
const searchController = require('../controllers/searchController');
const { protect } = require('../middlewares/authMiddleware');

// Tìm kiếm chuyên gia (public)
// GET /api/search/experts?q=keyword&specialization=...
router.get('/experts', searchController.searchExperts);

// Tìm kiếm bài tập (public)
// GET /api/search/exercises?q=keyword&category_id=...&difficulty=...
router.get('/exercises', searchController.searchExercises);

// Tìm kiếm toàn cục (public)
// GET /api/search?q=keyword
router.get('/', searchController.globalSearch);

// Các API lọc yêu cầu đăng nhập

// Lọc lịch hẹn
// GET /api/search/appointments?status=...&start_date=...&end_date=...
router.get('/appointments', protect, searchController.filterAppointments);

// Lọc nhật ký cảm xúc
// GET /api/search/emotion-logs?emotion=...&start_date=...&end_date=...
router.get('/emotion-logs', protect, searchController.filterEmotionLogs);

module.exports = router;
