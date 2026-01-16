const Suggestion = require('../models/suggestionModel');
const MindCategory = require('../models/mindCategoryModel');

// Lấy danh mục theo cảm xúc/intent
exports.getCategoriesByEmotion = async (req, res) => {
    try {
        const { emotion } = req.query;
        if (!emotion) {
            return res.status(400).json({ success: false, message: 'Thiếu tham số emotion' });
        }
        const categories = await MindCategory.getByIntent(emotion.toLowerCase());
        res.json({ success: true, data: categories });
    } catch (error) {
        console.error('Lỗi lấy danh mục theo cảm xúc:', error);
        res.status(500).json({ success: false, message: 'Lỗi server', error: String(error?.message || error) });
    }
};

// Lấy toàn bộ gợi ý thuộc về user đang đăng nhập
exports.getMySuggestions = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: 'Không xác định được người dùng.' });
        }
        const suggestions = await Suggestion.getByUserId(req.user.id);
        res.json(suggestions);
    } catch (error) {
        console.error('Lỗi lấy gợi ý:', error);
        res.status(500).json({ message: 'Lỗi server', error: String(error?.message || error) });
    }
};

// Lấy gợi ý theo 1 log cụ thể của user
exports.getSuggestionsByLog = async (req, res) => {
    try {
        const logId = req.params.logId;
        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: 'Không xác định được người dùng.' });
        }
        const suggestions = await Suggestion.getByLogForUser(logId, req.user.id);
        res.json(suggestions);
    } catch (error) {
        console.error('Lỗi lấy gợi ý theo log:', error);
        res.status(500).json({ message: 'Lỗi server', error: String(error?.message || error) });
    }
};

// Đánh dấu 1 gợi ý là đã xem
exports.markViewed = async (req, res) => {
    try {
        const suggestionId = req.params.id;
        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: 'Không xác định được người dùng.' });
        }
        const updated = await Suggestion.markViewedForUser(suggestionId, req.user.id);
        if (!updated) {
            return res.status(404).json({ message: 'Không tìm thấy gợi ý hoặc bạn không có quyền.' });
        }
        res.json({ message: 'Đã đánh dấu gợi ý là đã xem.' });
    } catch (error) {
        console.error('Lỗi cập nhật gợi ý:', error);
        res.status(500).json({ message: 'Lỗi server', error: String(error?.message || error) });
    }
};
