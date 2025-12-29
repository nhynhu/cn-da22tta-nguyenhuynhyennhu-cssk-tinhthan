const reviewModel = require('../models/reviewModel');

// Tạo hoặc cập nhật đánh giá
const createOrUpdateReview = async (req, res) => {
    try {
        const userId = req.user.user_id;
        const { target_type, target_id, rating, comment } = req.body;

        // Validation
        if (!target_type || !target_id || !rating) {
            return res.status(400).json({ message: 'Thiếu thông tin bắt buộc' });
        }

        if (rating < 1 || rating > 5) {
            return res.status(400).json({ message: 'Rating phải từ 1 đến 5' });
        }

        if (!['expert', 'exercise'].includes(target_type)) {
            return res.status(400).json({ message: 'target_type phải là "expert" hoặc "exercise"' });
        }

        const reviewId = await reviewModel.createReview(
            userId,
            target_type,
            target_id,
            rating,
            comment
        );

        res.json({
            success: true,
            message: 'Đánh giá đã được lưu',
            reviewId
        });
    } catch (error) {
        console.error('Lỗi khi tạo đánh giá:', error);
        res.status(500).json({ message: 'Lỗi server khi tạo đánh giá' });
    }
};

// Lấy danh sách đánh giá của một target
const getReviewsForTarget = async (req, res) => {
    try {
        const { target_type, target_id } = req.params;

        if (!['expert', 'exercise'].includes(target_type)) {
            return res.status(400).json({ message: 'target_type không hợp lệ' });
        }

        const reviews = await reviewModel.getReviewsByTarget(target_type, target_id);
        const stats = await reviewModel.getAverageRating(target_type, target_id);

        res.json({
            success: true,
            reviews,
            stats
        });
    } catch (error) {
        console.error('Lỗi khi lấy đánh giá:', error);
        res.status(500).json({ message: 'Lỗi server' });
    }
};

// Lấy đánh giá của user hiện tại cho một target
const getMyReviewForTarget = async (req, res) => {
    try {
        const userId = req.user.user_id;
        const { target_type, target_id } = req.params;

        const review = await reviewModel.getUserReviewForTarget(userId, target_type, target_id);

        res.json({
            success: true,
            review
        });
    } catch (error) {
        console.error('Lỗi khi lấy đánh giá của user:', error);
        res.status(500).json({ message: 'Lỗi server' });
    }
};

// Xóa đánh giá
const deleteReview = async (req, res) => {
    try {
        const userId = req.user.user_id;
        const { id } = req.params;

        const affectedRows = await reviewModel.deleteReview(id, userId);

        if (affectedRows === 0) {
            return res.status(404).json({ message: 'Không tìm thấy đánh giá' });
        }

        res.json({
            success: true,
            message: 'Đã xóa đánh giá'
        });
    } catch (error) {
        console.error('Lỗi khi xóa đánh giá:', error);
        res.status(500).json({ message: 'Lỗi server' });
    }
};

module.exports = {
    createOrUpdateReview,
    getReviewsForTarget,
    getMyReviewForTarget,
    deleteReview
};
