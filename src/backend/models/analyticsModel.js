const db = require('../config/db');

const Analytics = {
    // Thống kê cảm xúc từ emotion_logs theo user
    getEmotionStats: (userId, startDate = null, endDate = null) => {
        return new Promise((resolve, reject) => {
            let sql = `
                SELECT 
                    primary_emotion,
                    COUNT(*) as count,
                    DATE(created_at) as date
                FROM emotion_logs 
                WHERE user_id = ?
            `;
            const params = [userId];

            if (startDate) {
                sql += ` AND created_at >= ?`;
                params.push(startDate);
            }
            if (endDate) {
                sql += ` AND created_at <= ?`;
                params.push(endDate);
            }

            sql += ` GROUP BY primary_emotion, DATE(created_at) ORDER BY created_at DESC`;

            db.query(sql, params, (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            });
        });
    },

    // Thống kê cảm xúc từ chat_logs theo user
    getChatEmotionStats: (userId, startDate = null, endDate = null) => {
        return new Promise((resolve, reject) => {
            let sql = `
                SELECT 
                    emotion,
                    COUNT(*) as count,
                    DATE(created_at) as date
                FROM chat_logs 
                WHERE user_id = ? AND emotion IS NOT NULL
            `;
            const params = [userId];

            if (startDate) {
                sql += ` AND created_at >= ?`;
                params.push(startDate);
            }
            if (endDate) {
                sql += ` AND created_at <= ?`;
                params.push(endDate);
            }

            sql += ` GROUP BY emotion, DATE(created_at) ORDER BY created_at DESC`;

            db.query(sql, params, (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            });
        });
    },

    // Tổng hợp thống kê cảm xúc (emotion_logs + chat_logs)
    getCombinedEmotionStats: (userId, startDate = null, endDate = null) => {
        return new Promise((resolve, reject) => {
            let sql = `
                SELECT 
                    emotion_name,
                    SUM(count) as total_count,
                    date
                FROM (
                    SELECT 
                        primary_emotion as emotion_name,
                        COUNT(*) as count,
                        DATE(created_at) as date
                    FROM emotion_logs 
                    WHERE user_id = ?
            `;
            const params = [userId];

            if (startDate) {
                sql += ` AND created_at >= ?`;
                params.push(startDate);
            }
            if (endDate) {
                sql += ` AND created_at <= ?`;
                params.push(endDate);
            }

            sql += `
                    GROUP BY primary_emotion, DATE(created_at)
                    
                    UNION ALL
                    
                    SELECT 
                        emotion as emotion_name,
                        COUNT(*) as count,
                        DATE(created_at) as date
                    FROM chat_logs 
                    WHERE user_id = ? AND emotion IS NOT NULL
            `;
            params.push(userId);

            if (startDate) {
                sql += ` AND created_at >= ?`;
                params.push(startDate);
            }
            if (endDate) {
                sql += ` AND created_at <= ?`;
                params.push(endDate);
            }

            sql += `
                    GROUP BY emotion, DATE(created_at)
                ) as combined
                GROUP BY emotion_name, date
                ORDER BY date DESC, total_count DESC
            `;

            db.query(sql, params, (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            });
        });
    },

    // Thống kê tổng quan (pie chart data) - emotion_logs + chat_logs
    getEmotionSummary: (userId, days = 30) => {
        return new Promise((resolve, reject) => {
            const sql = `
                SELECT 
                    emotion_name,
                    SUM(count) as total
                FROM (
                    SELECT 
                        primary_emotion as emotion_name,
                        COUNT(*) as count
                    FROM emotion_logs 
                    WHERE user_id = ? AND created_at >= DATE_SUB(NOW(), INTERVAL ? DAY)
                    GROUP BY primary_emotion
                    
                    UNION ALL
                    
                    SELECT 
                        emotion as emotion_name,
                        COUNT(*) as count
                    FROM chat_logs 
                    WHERE user_id = ? AND emotion IS NOT NULL AND created_at >= DATE_SUB(NOW(), INTERVAL ? DAY)
                    GROUP BY emotion
                ) as combined
                GROUP BY emotion_name
                ORDER BY total DESC
            `;

            db.query(sql, [userId, days, userId, days], (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            });
        });
    },

    // Xu hướng cảm xúc theo ngày (line chart data) - emotion_logs + chat_logs
    getEmotionTrend: (userId, days = 30) => {
        return new Promise((resolve, reject) => {
            const sql = `
                SELECT 
                    date,
                    emotion_name,
                    SUM(total_count) as total_count
                FROM (
                    SELECT 
                        DATE(created_at) as date,
                        primary_emotion as emotion_name,
                        COUNT(*) as total_count
                    FROM emotion_logs 
                    WHERE user_id = ? AND created_at >= DATE_SUB(NOW(), INTERVAL ? DAY)
                    GROUP BY DATE(created_at), primary_emotion
                    
                    UNION ALL
                    
                    SELECT 
                        DATE(created_at) as date,
                        emotion as emotion_name,
                        COUNT(*) as total_count
                    FROM chat_logs 
                    WHERE user_id = ? AND emotion IS NOT NULL AND created_at >= DATE_SUB(NOW(), INTERVAL ? DAY)
                    GROUP BY DATE(created_at), emotion
                ) as combined
                GROUP BY date, emotion_name
                ORDER BY date DESC
            `;

            db.query(sql, [userId, days, userId, days], (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            });
        });
    }
};

module.exports = Analytics;
