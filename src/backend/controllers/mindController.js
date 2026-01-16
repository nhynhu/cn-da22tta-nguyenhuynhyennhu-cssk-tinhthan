const MindCategory = require('../models/mindCategoryModel');
const MindExercise = require('../models/mindExerciseModel');
const ExerciseView = require('../models/exerciseViewModel');

// Danh sách danh mục bài tập thiền/tâm lý
exports.getCategories = async (req, res) => {
    try {
        const categories = await MindCategory.getAllActive();
        res.json(categories);
    } catch (error) {
        console.error('Lỗi lấy danh mục bài tập:', error);
        res.status(500).json({ message: 'Lỗi server', error: String(error?.message || error) });
    }
};

// Danh sách bài tập, có thể lọc theo category_id
exports.getExercises = async (req, res) => {
    try {
        const categoryId = req.query.category_id;
        let exercises;
        if (categoryId) {
            exercises = await MindExercise.getByCategory(categoryId);
        } else {
            exercises = await MindExercise.getAllActive();
        }
        res.json(exercises);
    } catch (error) {
        console.error('Lỗi lấy bài tập:', error);
        res.status(500).json({ message: 'Lỗi server', error: String(error?.message || error) });
    }
};

// Lấy chi tiết 1 bài tập, đồng thời tăng view_count
exports.getExerciseDetail = async (req, res) => {
    try {
        const id = req.params.id;
        const exercise = await MindExercise.getById(id);
        if (!exercise) {
            return res.status(404).json({ message: 'Không tìm thấy bài tập.' });
        }
        // Tăng view_count không chặn response
        MindExercise.incrementViewCount(id).catch(err => {
            console.warn('Không tăng được view_count:', err.message);
        });
        res.json(exercise);
    } catch (error) {
        console.error('Lỗi lấy chi tiết bài tập:', error);
        res.status(500).json({ message: 'Lỗi server', error: String(error?.message || error) });
    }
};

// --- ADMIN CRUD: Danh mục ---

exports.createCategory = async (req, res) => {
    try {
        const { category_name, description, icon_url, intent, display_order, is_active } = req.body;
        if (!category_name || category_name.trim() === '') {
            return res.status(400).json({ message: 'Tên danh mục là bắt buộc.' });
        }
        const id = await MindCategory.create({ category_name, description, icon_url, intent, display_order, is_active });
        const created = await MindCategory.getById(id);
        res.status(201).json(created);
    } catch (error) {
        console.error('Lỗi tạo danh mục:', error);
        res.status(500).json({ message: 'Lỗi server', error: String(error?.message || error) });
    }
};

exports.updateCategory = async (req, res) => {
    try {
        const id = req.params.id;
        const { category_name, description, icon_url, intent, display_order, is_active } = req.body;
        const ok = await MindCategory.update(id, { category_name, description, icon_url, intent, display_order, is_active });
        if (!ok) {
            return res.status(404).json({ message: 'Không tìm thấy danh mục.' });
        }
        const updated = await MindCategory.getById(id);
        res.json(updated);
    } catch (error) {
        console.error('Lỗi cập nhật danh mục:', error);
        res.status(500).json({ message: 'Lỗi server', error: String(error?.message || error) });
    }
};

exports.deleteCategory = async (req, res) => {
    try {
        const id = req.params.id;
        const ok = await MindCategory.softDelete(id);
        if (!ok) {
            return res.status(404).json({ message: 'Không tìm thấy danh mục.' });
        }
        res.json({ message: 'Đã xóa danh mục (ẩn khỏi người dùng).' });
    } catch (error) {
        console.error('Lỗi xóa danh mục:', error);
        res.status(500).json({ message: 'Lỗi server', error: String(error?.message || error) });
    }
};

// --- ADMIN CRUD: Bài tập ---

exports.createExercise = async (req, res) => {
    try {
        const {
            category_id,
            title,
            description,
            duration_minutes,
            difficulty_level,
            media_type,
            media_url,
            instructions,
            is_active
        } = req.body;

        if (!category_id || !title || title.trim() === '') {
            return res.status(400).json({ message: 'Thiếu category_id hoặc title.' });
        }

        // Xử lý image upload (nếu có)
        let image_url = null;
        if (req.file) {
            image_url = `/uploads/exercises/${req.file.filename}`;
        }

        const id = await MindExercise.create({
            category_id,
            title,
            description,
            duration_minutes,
            difficulty_level,
            media_type,
            media_url,
            image_url,
            instructions,
            is_active
        });
        const created = await MindExercise.getById(id);
        res.status(201).json(created);
    } catch (error) {
        console.error('Lỗi tạo bài tập:', error);
        res.status(500).json({ message: 'Lỗi server', error: String(error?.message || error) });
    }
};

exports.updateExercise = async (req, res) => {
    try {
        const id = req.params.id;
        const {
            category_id,
            title,
            description,
            duration_minutes,
            difficulty_level,
            media_type,
            media_url,
            instructions,
            is_active
        } = req.body;

        // Lấy thông tin bài tập cũ để xóa ảnh cũ nếu có
        const oldExercise = await MindExercise.getById(id);
        let image_url = oldExercise?.image_url || null;

        // Nếu có file mới, xóa file cũ và cập nhật
        if (req.file) {
            // Xóa ảnh cũ nếu tồn tại
            if (oldExercise?.image_url) {
                const fs = require('fs');
                const path = require('path');
                const oldImagePath = path.join(__dirname, '..', oldExercise.image_url);
                if (fs.existsSync(oldImagePath)) {
                    fs.unlinkSync(oldImagePath);
                }
            }
            image_url = `/uploads/exercises/${req.file.filename}`;
        }

        const ok = await MindExercise.update(id, {
            category_id,
            title,
            description,
            duration_minutes,
            difficulty_level,
            media_type,
            media_url,
            image_url,
            instructions,
            is_active
        });

        if (!ok) {
            return res.status(404).json({ message: 'Không tìm thấy bài tập.' });
        }

        const updated = await MindExercise.getById(id);
        res.json(updated);
    } catch (error) {
        console.error('Lỗi cập nhật bài tập:', error);
        res.status(500).json({ message: 'Lỗi server', error: String(error?.message || error) });
    }
};

exports.deleteExercise = async (req, res) => {
    try {
        const id = req.params.id;
        const ok = await MindExercise.softDelete(id);
        if (!ok) {
            return res.status(404).json({ message: 'Không tìm thấy bài tập.' });
        }
        res.json({ message: 'Đã xóa bài tập (ẩn khỏi người dùng).' });
    } catch (error) {
        console.error('Lỗi xóa bài tập:', error);
        res.status(500).json({ message: 'Lỗi server', error: String(error?.message || error) });
    }
};

// Upload media cho exercise
exports.uploadExerciseMedia = async (req, res) => {
    try {
        const id = req.params.id;

        if (!req.file) {
            return res.status(400).json({ message: 'Không có file được upload' });
        }

        // Xác định media_type dựa trên mimetype
        let media_type = 'Video';
        if (req.file.mimetype.startsWith('audio/')) {
            media_type = 'Audio';
        } else if (req.file.mimetype.startsWith('image/')) {
            media_type = 'Image';
        }

        const media_url = `/uploads/exercises/${req.file.filename}`;

        // Cập nhật media_url và media_type cho exercise
        const ok = await MindExercise.update(id, { media_url, media_type });

        if (!ok) {
            return res.status(404).json({ message: 'Không tìm thấy bài tập' });
        }

        const updated = await MindExercise.getById(id);
        res.json({
            success: true,
            message: 'Upload media thành công',
            exercise: updated
        });
    } catch (error) {
        console.error('Lỗi upload media:', error);
        res.status(500).json({ message: 'Lỗi server', error: String(error?.message || error) });
    }
};

// --- EXERCISE VIEW TRACKING ---

// Ghi nhận user xem bài tập
exports.recordView = async (req, res) => {
    try {
        const userId = req.user.id;
        const exerciseId = req.params.id;

        // Kiểm tra bài tập tồn tại
        const exercise = await MindExercise.getById(exerciseId);
        if (!exercise) {
            return res.status(404).json({ message: 'Không tìm thấy bài tập.' });
        }

        // Ghi nhận view và kiểm tra xem có phải lần đầu không
        const result = await ExerciseView.createView(userId, exerciseId);

        // Chỉ tăng view_count nếu là lần xem đầu tiên
        if (result.isFirstView) {
            await MindExercise.incrementViewCount(exerciseId);
        }

        res.json({ message: 'Đã ghi nhận lượt xem.' });
    } catch (error) {
        console.error('Lỗi ghi nhận view:', error);
        res.status(500).json({ message: 'Lỗi server', error: String(error?.message || error) });
    }
};

// Đánh dấu bài tập đã hoàn thành
exports.markCompleted = async (req, res) => {
    try {
        const userId = req.user.id;
        const exerciseId = req.params.id;

        // Kiểm tra bài tập tồn tại
        const exercise = await MindExercise.getById(exerciseId);
        if (!exercise) {
            return res.status(404).json({ message: 'Không tìm thấy bài tập.' });
        }

        await ExerciseView.markCompleted(userId, exerciseId);
        res.json({ message: 'Đã đánh dấu hoàn thành bài tập!' });
    } catch (error) {
        console.error('Lỗi đánh dấu hoàn thành:', error);
        res.status(500).json({ message: 'Lỗi server', error: String(error?.message || error) });
    }
};

// Lấy lịch sử xem của user hiện tại
exports.getMyViewHistory = async (req, res) => {
    try {
        const userId = req.user.id;
        const limit = parseInt(req.query.limit) || 20;

        const history = await ExerciseView.getUserViewHistory(userId, limit);
        res.json(history);
    } catch (error) {
        console.error('Lỗi lấy lịch sử xem:', error);
        res.status(500).json({ message: 'Lỗi server', error: String(error?.message || error) });
    }
};

// Lấy thống kê view của một bài tập
exports.getExerciseViewStats = async (req, res) => {
    try {
        const exerciseId = req.params.id;
        const stats = await ExerciseView.getExerciseStats(exerciseId);
        res.json(stats);
    } catch (error) {
        console.error('Lỗi lấy thống kê view:', error);
        res.status(500).json({ message: 'Lỗi server', error: String(error?.message || error) });
    }
};

// Lấy danh sách bài tập đã hoàn thành
exports.getCompletedExercises = async (req, res) => {
    try {
        const userId = req.user.id;
        const completed = await ExerciseView.getCompletedExercises(userId);
        res.json(completed);
    } catch (error) {
        console.error('Lỗi lấy bài tập đã hoàn thành:', error);
        res.status(500).json({ message: 'Lỗi server', error: String(error?.message || error) });
    }
};
