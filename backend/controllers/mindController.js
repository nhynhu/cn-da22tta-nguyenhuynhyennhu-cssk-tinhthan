const MindCategory = require('../models/mindCategoryModel');
const MindExercise = require('../models/mindExerciseModel');

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

        const id = await MindExercise.create({
            category_id,
            title,
            description,
            duration_minutes,
            difficulty_level,
            media_type,
            media_url,
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

        const ok = await MindExercise.update(id, {
            category_id,
            title,
            description,
            duration_minutes,
            difficulty_level,
            media_type,
            media_url,
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
