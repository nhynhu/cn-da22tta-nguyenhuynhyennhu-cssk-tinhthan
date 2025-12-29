const db = require('../config/db');

const MindExercise = {
    // Lấy tất cả bài tập đang active
    getAllActive: () => {
        const sql = `
            SELECT me.*, mc.category_name
            FROM mind_exercises me
            LEFT JOIN mind_categories mc ON me.category_id = mc.category_id
            WHERE me.is_active = 1
            ORDER BY me.created_at DESC
        `;
        return new Promise((resolve, reject) => {
            db.query(sql, (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            });
        });
    },

    // Lấy bài tập theo category
    getByCategory: (categoryId) => {
        const sql = `
            SELECT me.*, mc.category_name
            FROM mind_exercises me
            LEFT JOIN mind_categories mc ON me.category_id = mc.category_id
            WHERE me.is_active = 1 AND me.category_id = ?
            ORDER BY me.created_at DESC
        `;
        return new Promise((resolve, reject) => {
            db.query(sql, [categoryId], (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            });
        });
    },

    getById: (id) => {
        const sql = `
            SELECT me.*, mc.category_name
            FROM mind_exercises me
            LEFT JOIN mind_categories mc ON me.category_id = mc.category_id
            WHERE me.exercise_id = ?
        `;
        return new Promise((resolve, reject) => {
            db.query(sql, [id], (err, rows) => {
                if (err) return reject(err);
                resolve(rows[0] || null);
            });
        });
    },

    // Tăng view_count khi người dùng xem bài tập
    incrementViewCount: (id) => {
        const sql = 'UPDATE mind_exercises SET view_count = view_count + 1 WHERE exercise_id = ?';
        return new Promise((resolve, reject) => {
            db.query(sql, [id], (err, result) => {
                if (err) return reject(err);
                resolve(result.affectedRows > 0);
            });
        });
    },

    // Tạo bài tập mới
    create: (exercise) => {
        const {
            category_id,
            title,
            description,
            duration_minutes = null,
            difficulty_level = null,
            media_type = null,
            media_url = null,
            image_url = null,
            instructions = null,
            is_active = 1
        } = exercise;

        const sql = `
            INSERT INTO mind_exercises (
                category_id, title, description, duration_minutes,
                difficulty_level, media_type, media_url, image_url, instructions, is_active
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        return new Promise((resolve, reject) => {
            db.query(
                sql,
                [category_id, title, description, duration_minutes, difficulty_level, media_type, media_url, image_url, instructions, is_active],
                (err, result) => {
                    if (err) return reject(err);
                    resolve(result.insertId);
                }
            );
        });
    },

    // Cập nhật bài tập
    update: (id, exercise) => {
        const {
            category_id,
            title,
            description,
            duration_minutes = null,
            difficulty_level = null,
            media_type = null,
            media_url = null,
            image_url = null,
            instructions = null,
            is_active = 1
        } = exercise;

        const sql = `
            UPDATE mind_exercises
            SET category_id = ?, title = ?, description = ?, duration_minutes = ?,
                difficulty_level = ?, media_type = ?, media_url = ?, image_url = ?, instructions = ?, is_active = ?
            WHERE exercise_id = ?
        `;
        return new Promise((resolve, reject) => {
            db.query(
                sql,
                [category_id, title, description, duration_minutes, difficulty_level, media_type, media_url, image_url, instructions, is_active, id],
                (err, result) => {
                    if (err) return reject(err);
                    resolve(result.affectedRows > 0);
                }
            );
        });
    },

    // "Xóa" bài tập: đánh dấu không active
    softDelete: (id) => {
        const sql = 'UPDATE mind_exercises SET is_active = 0 WHERE exercise_id = ?';
        return new Promise((resolve, reject) => {
            db.query(sql, [id], (err, result) => {
                if (err) return reject(err);
                resolve(result.affectedRows > 0);
            });
        });
    }
};

module.exports = MindExercise;
