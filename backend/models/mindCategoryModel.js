const db = require('../config/db');

const MindCategory = {
    // Lấy danh sách danh mục đang active
    getAllActive: () => {
        const sql = `
            SELECT *
            FROM mind_categories
            WHERE is_active = 1
            ORDER BY display_order, category_name
        `;
        return new Promise((resolve, reject) => {
            db.query(sql, (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            });
        });
    },

    getById: (id) => {
        const sql = 'SELECT * FROM mind_categories WHERE category_id = ?';
        return new Promise((resolve, reject) => {
            db.query(sql, [id], (err, rows) => {
                if (err) return reject(err);
                resolve(rows[0] || null);
            });
        });
    },

    // Lấy danh mục theo intent (ví dụ: joy, sadness, anger...)
    getByIntent: (intent) => {
        const sql = `
            SELECT *
            FROM mind_categories
            WHERE is_active = 1 AND intent = ?
            ORDER BY display_order, category_name
        `;
        return new Promise((resolve, reject) => {
            db.query(sql, [intent], (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            });
        });
    },

    // Tạo danh mục mới
    create: (category) => {
        const { category_name, description, icon_url, intent, display_order = 0, is_active = 1 } = category;
        const sql = `
            INSERT INTO mind_categories (category_name, description, icon_url, intent, display_order, is_active)
            VALUES (?, ?, ?, ?, ?, ?)
        `;
        return new Promise((resolve, reject) => {
            db.query(sql, [category_name, description, icon_url, intent, display_order, is_active], (err, result) => {
                if (err) return reject(err);
                resolve(result.insertId);
            });
        });
    },

    // Cập nhật danh mục
    update: (id, category) => {
        const { category_name, description, icon_url, intent, display_order = 0, is_active = 1 } = category;
        const sql = `
            UPDATE mind_categories
            SET category_name = ?, description = ?, icon_url = ?, intent = ?, display_order = ?, is_active = ?
            WHERE category_id = ?
        `;
        return new Promise((resolve, reject) => {
            db.query(sql, [category_name, description, icon_url, intent, display_order, is_active, id], (err, result) => {
                if (err) return reject(err);
                resolve(result.affectedRows > 0);
            });
        });
    },

    // "Xóa" danh mục: đánh dấu không active (tránh lỗi khóa ngoại)
    softDelete: (id) => {
        const sql = 'UPDATE mind_categories SET is_active = 0 WHERE category_id = ?';
        return new Promise((resolve, reject) => {
            db.query(sql, [id], (err, result) => {
                if (err) return reject(err);
                resolve(result.affectedRows > 0);
            });
        });
    }
};

module.exports = MindCategory;
