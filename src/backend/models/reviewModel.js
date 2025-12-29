const db = require('../config/db');

// Tạo đánh giá mới
const createReview = async (userId, targetType, targetId, rating, comment = null) => {
    // Kiểm tra xem user đã đánh giá chưa
    const checkQuery = `
        SELECT review_id FROM reviews
        WHERE user_id = ? AND target_type = ? AND target_id = ?
    `;
    const [existing] = await db.query(checkQuery, [userId, targetType, targetId]);

    if (existing.length > 0) {
        // Cập nhật đánh giá cũ
        const updateQuery = `
            UPDATE reviews
            SET rating = ?, comment = ?
            WHERE user_id = ? AND target_type = ? AND target_id = ?
        `;
        await db.query(updateQuery, [rating, comment, userId, targetType, targetId]);
        return existing[0].review_id;
    } else {
        // Tạo đánh giá mới
        const insertQuery = `
            INSERT INTO reviews (user_id, target_type, target_id, rating, comment)
            VALUES (?, ?, ?, ?, ?)
        `;
        const [result] = await db.query(insertQuery, [userId, targetType, targetId, rating, comment]);
        return result.insertId;
    }
};

// Lấy đánh giá của một target (expert hoặc exercise)
const getReviewsByTarget = async (targetType, targetId) => {
    const query = `
        SELECT r.*, u.full_name, u.email
        FROM reviews r
        JOIN users u ON r.user_id = u.user_id
        WHERE r.target_type = ? AND r.target_id = ?
        ORDER BY r.created_at DESC
    `;
    const [rows] = await db.query(query, [targetType, targetId]);
    return rows;
};

// Tính rating trung bình
const getAverageRating = async (targetType, targetId) => {
    const query = `
        SELECT 
            AVG(rating) as average_rating,
            COUNT(*) as total_reviews
        FROM reviews
        WHERE target_type = ? AND target_id = ?
    `;
    const [rows] = await db.query(query, [targetType, targetId]);
    return {
        averageRating: parseFloat(rows[0].average_rating) || 0,
        totalReviews: rows[0].total_reviews
    };
};

// Xóa đánh giá
const deleteReview = async (reviewId, userId) => {
    const query = `
        DELETE FROM reviews
        WHERE review_id = ? AND user_id = ?
    `;
    const [result] = await db.query(query, [reviewId, userId]);
    return result.affectedRows;
};

// Lấy đánh giá của user cho một target cụ thể
const getUserReviewForTarget = async (userId, targetType, targetId) => {
    const query = `
        SELECT * FROM reviews
        WHERE user_id = ? AND target_type = ? AND target_id = ?
    `;
    const [rows] = await db.query(query, [userId, targetType, targetId]);
    return rows[0] || null;
};

module.exports = {
    createReview,
    getReviewsByTarget,
    getAverageRating,
    deleteReview,
    getUserReviewForTarget
};
