const express = require('express');
const router = express.Router();
const mindController = require('../controllers/mindController');
const { protect, requireRole } = require('../middlewares/authMiddleware');

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

router.post('/exercises', protect, requireRole(['admin']), mindController.createExercise);
router.put('/exercises/:id', protect, requireRole(['admin']), mindController.updateExercise);
router.delete('/exercises/:id', protect, requireRole(['admin']), mindController.deleteExercise);

module.exports = router;
