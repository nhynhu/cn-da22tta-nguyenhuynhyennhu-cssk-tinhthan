const db = require('../config/db');

// Tìm kiếm chuyên gia
const searchExperts = async (searchTerm, specialization = null) => {
    let query = `
        SELECT e.*, u.full_name, u.email
        FROM experts e
        JOIN users u ON e.user_id = u.user_id
        WHERE 1=1
    `;
    const params = [];

    if (searchTerm) {
        query += ` AND (u.full_name LIKE ? OR e.specialization LIKE ?)`;
        params.push(`%${searchTerm}%`, `%${searchTerm}%`);
    }

    if (specialization) {
        query += ` AND e.specialization LIKE ?`;
        params.push(`%${specialization}%`);
    }

    query += ` ORDER BY u.full_name`;

    const [rows] = await db.query(query, params);
    return rows;
};

// Tìm kiếm bài tập thiền
const searchExercises = async (searchTerm, categoryId = null, difficulty = null) => {
    let query = `
        SELECT e.*, c.category_name
        FROM mind_exercises e
        LEFT JOIN mind_categories c ON e.category_id = c.category_id
        WHERE e.is_active = 1
    `;
    const params = [];

    if (searchTerm) {
        query += ` AND (e.title LIKE ? OR e.description LIKE ?)`;
        params.push(`%${searchTerm}%`, `%${searchTerm}%`);
    }

    if (categoryId) {
        query += ` AND e.category_id = ?`;
        params.push(categoryId);
    }

    if (difficulty) {
        query += ` AND e.difficulty_level = ?`;
        params.push(difficulty);
    }

    query += ` ORDER BY e.view_count DESC, e.created_at DESC`;

    const [rows] = await db.query(query, params);
    return rows;
};

// Lọc lịch hẹn theo nhiều tiêu chí
const filterAppointments = async (userId, role, status = null, startDate = null, endDate = null) => {
    let query = `
        SELECT 
            ca.*,
            u.full_name as user_name,
            u.email as user_email,
            expert_user.full_name as expert_name,
            e.specialization
        FROM consultation_appointments ca
        JOIN users u ON ca.user_id = u.user_id
        JOIN experts e ON ca.expert_id = e.expert_id
        JOIN users expert_user ON e.user_id = expert_user.user_id
        WHERE 1=1
    `;
    const params = [];

    // Lọc theo role
    if (role === 'expert') {
        query += ` AND e.user_id = ?`;
        params.push(userId);
    } else {
        query += ` AND ca.user_id = ?`;
        params.push(userId);
    }

    // Lọc theo trạng thái
    if (status) {
        query += ` AND ca.status = ?`;
        params.push(status);
    }

    // Lọc theo khoảng thời gian
    if (startDate) {
        query += ` AND ca.scheduled_at >= ?`;
        params.push(startDate);
    }

    if (endDate) {
        query += ` AND ca.scheduled_at <= ?`;
        params.push(endDate);
    }

    query += ` ORDER BY ca.scheduled_at DESC`;

    const [rows] = await db.query(query, params);
    return rows;
};

// Lọc nhật ký cảm xúc
const filterEmotionLogs = async (userId, emotion = null, startDate = null, endDate = null) => {
    let query = `
        SELECT * FROM emotion_logs
        WHERE user_id = ?
    `;
    const params = [userId];

    if (emotion) {
        query += ` AND primary_emotion = ?`;
        params.push(emotion);
    }

    if (startDate) {
        query += ` AND log_date >= ?`;
        params.push(startDate);
    }

    if (endDate) {
        query += ` AND log_date <= ?`;
        params.push(endDate);
    }

    query += ` ORDER BY log_date DESC`;

    const [rows] = await db.query(query, params);
    return rows;
};

// Tìm kiếm toàn cục
const globalSearch = async (searchTerm) => {
    const results = {
        experts: [],
        exercises: [],
        categories: []
    };

    // Tìm chuyên gia
    const expertsQuery = `
        SELECT e.expert_id as id, u.full_name as title, e.specialization as description, 'expert' as type
        FROM experts e
        JOIN users u ON e.user_id = u.user_id
        WHERE u.full_name LIKE ? OR e.specialization LIKE ?
        LIMIT 5
    `;
    const [experts] = await db.query(expertsQuery, [`%${searchTerm}%`, `%${searchTerm}%`]);
    results.experts = experts;

    // Tìm bài tập
    const exercisesQuery = `
        SELECT exercise_id as id, title, description, 'exercise' as type
        FROM mind_exercises
        WHERE is_active = 1 AND (title LIKE ? OR description LIKE ?)
        LIMIT 5
    `;
    const [exercises] = await db.query(exercisesQuery, [`%${searchTerm}%`, `%${searchTerm}%`]);
    results.exercises = exercises;

    // Tìm danh mục
    const categoriesQuery = `
        SELECT category_id as id, category_name as title, description, 'category' as type
        FROM mind_categories
        WHERE is_active = 1 AND (category_name LIKE ? OR description LIKE ?)
        LIMIT 5
    `;
    const [categories] = await db.query(categoriesQuery, [`%${searchTerm}%`, `%${searchTerm}%`]);
    results.categories = categories;

    return results;
};

module.exports = {
    searchExperts,
    searchExercises,
    filterAppointments,
    filterEmotionLogs,
    globalSearch
};
