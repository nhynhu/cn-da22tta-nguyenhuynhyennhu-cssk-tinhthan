const db = require('../config/db');

const Appointment = {
    create: (userId, expertId, scheduledAt, meetingType, durationMinutes, note) => {
        const sql = `INSERT INTO consultation_appointments 
                     (expert_id, user_id, scheduled_at, meeting_type, duration_minutes, status, meeting_link, created_at)
                     VALUES (?, ?, ?, ?, ?, 'Pending', ?, NOW())`;
        return new Promise((resolve, reject) => {
            db.query(sql, [expertId, userId, scheduledAt, meetingType || 'Online', durationMinutes || 60, note || null], (err, result) => {
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
    },

    // Cập nhật lịch hẹn (cho user)
    update: (appointmentId, userId, expertId, scheduledAt, note) => {
        const sql = `UPDATE consultation_appointments 
                     SET expert_id = ?, scheduled_at = ?, meeting_link = ?
                     WHERE appointment_id = ? AND user_id = ?`;
        return new Promise((resolve, reject) => {
            db.query(sql, [expertId, scheduledAt, note || null, appointmentId, userId], (err, result) => {
                if (err) return reject(err);
                resolve(result.affectedRows);
            });
        });
    },

    // Xóa lịch hẹn (cho user)
    delete: (appointmentId, userId) => {
        const sql = `DELETE FROM consultation_appointments WHERE appointment_id = ? AND user_id = ?`;
        return new Promise((resolve, reject) => {
            db.query(sql, [appointmentId, userId], (err, result) => {
                if (err) return reject(err);
                resolve(result.affectedRows);
            });
        });
    },

    // Lấy lịch hẹn theo ID
    getById: (appointmentId) => {
        const sql = `SELECT * FROM consultation_appointments WHERE appointment_id = ?`;
        return new Promise((resolve, reject) => {
            db.query(sql, [appointmentId], (err, rows) => {
                if (err) return reject(err);
                resolve(rows[0]);
            });
        });
    }
};

module.exports = Appointment;
