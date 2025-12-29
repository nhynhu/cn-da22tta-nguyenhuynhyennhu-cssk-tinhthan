const db = require('../config/db');

const ExerciseView = {
    // Tạo/cập nhật view mới
    createView: (userId, exerciseId) => {
        return new Promise((resolve, reject) => {
            db.query(
                'INSERT INTO exercise_views (user_id, exercise_id, viewed_at) VALUES (?, ?, NOW())',
                [userId, exerciseId],
                (err, result) => {
                    if (err) return reject(err);
                    resolve(result);
                }
            );
        });
    },

    // Đánh dấu bài tập đã hoàn thành
    markCompleted: (userId, exerciseId) => {
        return new Promise((resolve, reject) => {
            // Tìm view gần nhất
            db.query(
                'SELECT view_id FROM exercise_views WHERE user_id = ? AND exercise_id = ? ORDER BY viewed_at DESC LIMIT 1',
                [userId, exerciseId],
                (err, rows) => {
                    if (err) return reject(err);
                    if (rows.length === 0) {
                        // Tạo mới nếu chưa có
                        db.query(
                            'INSERT INTO exercise_views (user_id, exercise_id, viewed_at, completed) VALUES (?, ?, NOW(), 1)',
                            [userId, exerciseId],
                            (err2, result) => {
                                if (err2) return reject(err2);
                                resolve(result);
                            }
                        );
                    } else {
                        // Cập nhật completed
                        db.query(
                            'UPDATE exercise_views SET completed = 1 WHERE view_id = ?',
                            [rows[0].view_id],
                            (err2, result) => {
                                if (err2) return reject(err2);
                                resolve(result);
                            }
                        );
                    }
                }
            );
        });
    },

    // Lấy lịch sử xem của user
    getUserViewHistory: (userId, limit = 20) => {
        return new Promise((resolve, reject) => {
            db.query(
                `SELECT ev.*, me.title, me.description, me.duration_minutes, me.media_type 
                 FROM exercise_views ev 
                 JOIN mind_exercises me ON ev.exercise_id = me.exercise_id 
                 WHERE ev.user_id = ? 
                 ORDER BY ev.viewed_at DESC 
                 LIMIT ?`,
                [userId, limit],
                (err, rows) => {
                    if (err) return reject(err);
                    resolve(rows);
                }
            );
        });
    },

    // Lấy thống kê view của một bài tập
    getExerciseStats: (exerciseId) => {
        return new Promise((resolve, reject) => {
            db.query(
                `SELECT 
                    COUNT(*) as total_views,
                    COUNT(DISTINCT user_id) as unique_viewers,
                    SUM(completed) as total_completed
                 FROM exercise_views 
                 WHERE exercise_id = ?`,
                [exerciseId],
                (err, rows) => {
                    if (err) return reject(err);
                    resolve(rows[0]);
                }
            );
        });
    },

    // Kiểm tra user đã xem bài tập chưa
    hasUserViewed: (userId, exerciseId) => {
        return new Promise((resolve, reject) => {
            db.query(
                'SELECT * FROM exercise_views WHERE user_id = ? AND exercise_id = ? LIMIT 1',
                [userId, exerciseId],
                (err, rows) => {
                    if (err) return reject(err);
                    resolve(rows.length > 0);
                }
            );
        });
    },

    // Lấy bài tập đã hoàn thành
    getCompletedExercises: (userId) => {
        return new Promise((resolve, reject) => {
            db.query(
                `SELECT DISTINCT ev.exercise_id, me.title, me.description, me.duration_minutes,
                        MAX(ev.viewed_at) as last_completed_at
                 FROM exercise_views ev
                 JOIN mind_exercises me ON ev.exercise_id = me.exercise_id
                 WHERE ev.user_id = ? AND ev.completed = 1
                 GROUP BY ev.exercise_id
                 ORDER BY last_completed_at DESC`,
                [userId],
                (err, rows) => {
                    if (err) return reject(err);
                    resolve(rows);
                }
            );
        });
    }
};

module.exports = ExerciseView;
