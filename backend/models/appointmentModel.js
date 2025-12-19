const db = require('../config/db');

const Appointment = {
    create: (userId, expertId, scheduledAt, note) => {
        // Lưu note tạm vào meeting_link, các trường khác để NULL hoặc giá trị mặc định
        const sql = `INSERT INTO consultation_appointments (expert_id, user_id, scheduled_at, status, meeting_link, created_at)
                     VALUES (?, ?, ?, 'Pending', ?, NOW())`;
        return new Promise((resolve, reject) => {
            db.query(sql, [expertId, userId, scheduledAt, note || null], (err, result) => {
                if (err) return reject(err);
                resolve(result.insertId);
            });
        });
    },

    // Lịch hẹn của 1 user (bệnh nhân)
    getByUser: (userId) => {
        // Lấy tên/email chuyên gia từ bảng users thông qua experts.user_id
        const sql = `
            SELECT 
                a.*, 
                u.full_name AS expert_name, 
                u.email AS expert_email
            FROM consultation_appointments a
            JOIN experts e ON a.expert_id = e.expert_id
            JOIN users u ON e.user_id = u.user_id
            WHERE a.user_id = ?
            ORDER BY a.scheduled_at DESC
        `;
        return new Promise((resolve, reject) => {
            db.query(sql, [userId], (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            });
        });
    },

    // Lịch hẹn của 1 chuyên gia (lọc theo user_id của chuyên gia trong bảng users)
    getByDoctor: (doctorId) => {
        const sql = `
            SELECT 
                a.*, 
                u.full_name AS user_name, 
                u.email AS user_email
            FROM consultation_appointments a
            JOIN users u ON a.user_id = u.user_id
            JOIN experts e ON a.expert_id = e.expert_id
            WHERE e.user_id = ?
            ORDER BY a.scheduled_at DESC
        `;
        return new Promise((resolve, reject) => {
            db.query(sql, [doctorId], (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            });
        });
    },

    // Cập nhật trạng thái lịch hẹn (cho bác sĩ)
    updateStatus: (appointmentId, status) => {
        const sql = `UPDATE consultation_appointments SET status = ? WHERE appointment_id = ?`;
        return new Promise((resolve, reject) => {
            db.query(sql, [status, appointmentId], (err, result) => {
                if (err) return reject(err);
                resolve(result.affectedRows);
            });
        });
    }
};

module.exports = Appointment;
