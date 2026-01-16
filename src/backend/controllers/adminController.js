const db = require('../config/db');

// Lấy thống kê admin
exports.getStats = async (req, res) => {
    try {
        // Đếm số người dùng
        const usersQuery = 'SELECT COUNT(*) as count FROM users';
        const usersResult = await new Promise((resolve, reject) => {
            db.query(usersQuery, (err, results) => {
                if (err) reject(err);
                else resolve(results);
            });
        });
        const users = usersResult[0].count;

        // Đếm số chuyên gia
        const expertsQuery = 'SELECT COUNT(*) as count FROM experts';
        const expertsResult = await new Promise((resolve, reject) => {
            db.query(expertsQuery, (err, results) => {
                if (err) reject(err);
                else resolve(results);
            });
        });
        const experts = expertsResult[0].count;

        // Đếm số danh mục
        const categoriesQuery = 'SELECT COUNT(*) as count FROM mind_categories WHERE is_active = 1';
        const categoriesResult = await new Promise((resolve, reject) => {
            db.query(categoriesQuery, (err, results) => {
                if (err) reject(err);
                else resolve(results);
            });
        });
        const categories = categoriesResult[0].count;

        // Đếm số bài tập
        const exercisesQuery = 'SELECT COUNT(*) as count FROM mind_exercises';
        const exercisesResult = await new Promise((resolve, reject) => {
            db.query(exercisesQuery, (err, results) => {
                if (err) reject(err);
                else resolve(results);
            });
        });
        const exercises = exercisesResult[0].count;

        res.json({
            users,
            experts,
            categories,
            exercises
        });
    } catch (error) {
        console.error('Lỗi lấy thống kê admin:', error);
        res.status(500).json({ message: 'Lỗi server' });
    }
};
