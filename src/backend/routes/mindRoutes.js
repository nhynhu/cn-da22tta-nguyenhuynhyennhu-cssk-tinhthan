const express = require('express');
const router = express.Router();
const mindController = require('../controllers/mindController');
const { protect, requireRole } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware'); // Sử dụng uploadMiddleware thay vì định nghĩa riêng

// Các API public chỉ đọc dữ liệu, không bắt buộc đăng nhập

// GET /api/mind/categories - Danh sách danh mục bài tập (chỉ các mục active)
router.get('/categories', mindController.getCategories);

// GET /api/mind/exercises?category_id=1 - Danh sách bài tập (lọc theo danh mục nếu có, chỉ các mục active)
router.get('/exercises', mindController.getExercises);

// GET /api/mind/exercises/:id - Chi tiết 1 bài tập
router.get('/exercises/:id', mindController.getExerciseDetail);

// --- ADMIN CRUD (yêu cầu token admin) ---
router.post('/categories', protect, requireRole(['admin']), mindController.createCategory);
router.put('/categories/:id', protect, requireRole(['admin']), mindController.updateCategory);
router.delete('/categories/:id', protect, requireRole(['admin']), mindController.deleteCategory);

router.post('/exercises', protect, requireRole(['admin']), upload.single('image'), mindController.createExercise);
router.put('/exercises/:id', protect, requireRole(['admin']), upload.single('image'), mindController.updateExercise);
router.delete('/exercises/:id', protect, requireRole(['admin']), mindController.deleteExercise);

// POST /api/mind/exercises/:id/media - Upload media cho exercise
router.post('/exercises/:id/media', protect, requireRole(['admin']), upload.single('media'), mindController.uploadExerciseMedia);

// --- EXERCISE VIEW TRACKING (yêu cầu đăng nhập) ---
router.post('/exercises/:id/view', protect, mindController.recordView);
router.post('/exercises/:id/complete', protect, mindController.markCompleted);
router.get('/exercises/:id/stats', mindController.getExerciseViewStats); // Public để hiển thị số lượt xem
router.get('/my-history', protect, mindController.getMyViewHistory);
router.get('/my-completed', protect, mindController.getCompletedExercises);

module.exports = router;
