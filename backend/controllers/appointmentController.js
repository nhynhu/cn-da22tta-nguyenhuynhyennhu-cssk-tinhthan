const Appointment = require('../models/appointmentModel');

// Tạo lịch hẹn (bệnh nhân đặt với chuyên gia)
// POST /api/appointments
// body: { doctorId|expertId, appointmentTime(ISO string), meetingType, durationMinutes, note }
exports.createAppointment = async (req, res) => {
    try {
        const { doctorId, expertId, appointmentTime, meetingType, durationMinutes, note } = req.body;
        const currentUser = req.user;

        const targetExpertId = expertId || doctorId;

        if (!targetExpertId || !appointmentTime) {
            return res.status(400).json({ message: 'Thiếu thông tin chuyên gia hoặc thời gian.' });
        }

        // Chỉ user (bệnh nhân) mới được tạo lịch
        if (currentUser.role !== 'user') {
            return res.status(403).json({ message: 'Chỉ bệnh nhân mới được đặt lịch.' });
        }

        const id = await Appointment.create(
            currentUser.id,
            targetExpertId,
            appointmentTime,
            meetingType || 'Online',
            durationMinutes || 60,
            note
        );
        res.status(201).json({ message: 'Đã tạo lịch hẹn.', id });
    } catch (error) {
        console.error('[Appointment] createAppointment error:', error);
        res.status(500).json({ message: 'Lỗi server khi tạo lịch hẹn.' });
    }
};

// Lấy lịch hẹn của user/chuyên gia hiện tại
// GET /api/appointments/mine
exports.getMyAppointments = async (req, res) => {
    try {
        const currentUser = req.user;

        // Chuyên gia (role 'expert') xem các lịch hẹn mà mình là chuyên gia
        if (currentUser.role === 'expert') {
            const list = await Appointment.getByDoctor(currentUser.id);
            return res.json({ data: list });
        } else {
            const list = await Appointment.getByUser(currentUser.id);
            return res.json({ data: list });
        }
    } catch (error) {
        console.error('[Appointment] getMyAppointments error:', error);
        res.status(500).json({ message: 'Lỗi server khi lấy lịch hẹn.' });
    }
};

// Chuyên gia cập nhật trạng thái lịch hẹn
// PATCH /api/appointments/:id/status  body: { status }
exports.updateStatus = async (req, res) => {
    try {
        const currentUser = req.user;
        const { status } = req.body;
        const id = parseInt(req.params.id, 10);

        // Cho phép cả 'expert' và 'doctor' duyệt/hủy lịch hẹn
        if (currentUser.role !== 'expert' && currentUser.role !== 'doctor') {
            return res.status(403).json({ message: 'Chỉ chuyên gia mới được cập nhật trạng thái.' });
        }
        if (!id || !status) {
            return res.status(400).json({ message: 'Thiếu id hoặc trạng thái.' });
        }

        // Theo comment trong CSDL: Pending, Confirmed, Completed, Cancelled
        const allowed = ['Pending', 'Confirmed', 'Cancelled', 'Completed'];
        if (!allowed.includes(status)) {
            return res.status(400).json({ message: 'Trạng thái không hợp lệ.' });
        }

        const affected = await Appointment.updateStatus(id, status);
        if (!affected) {
            return res.status(404).json({ message: 'Không tìm thấy lịch hẹn.' });
        }

        res.json({ message: 'Đã cập nhật trạng thái.' });
    } catch (error) {
        console.error('[Appointment] updateStatus error:', error);
        res.status(500).json({ message: 'Lỗi server khi cập nhật lịch hẹn.' });
    }
};

// User cập nhật lịch hẹn
// PUT /api/appointments/:id  body: { doctorId, appointmentTime, note }
exports.updateAppointment = async (req, res) => {
    try {
        const currentUser = req.user;
        const { doctorId, expertId, appointmentTime, note } = req.body;
        const id = parseInt(req.params.id, 10);

        if (currentUser.role !== 'user') {
            return res.status(403).json({ message: 'Chỉ người dùng mới được sửa lịch hẹn.' });
        }

        const targetExpertId = expertId || doctorId;
        if (!id || !targetExpertId || !appointmentTime) {
            return res.status(400).json({ message: 'Thiếu thông tin cần thiết.' });
        }

        // Kiểm tra lịch hẹn có tồn tại và thuộc về user này không
        const appointment = await Appointment.getById(id);
        if (!appointment) {
            return res.status(404).json({ message: 'Không tìm thấy lịch hẹn.' });
        }
        if (appointment.user_id !== currentUser.id) {
            return res.status(403).json({ message: 'Bạn không có quyền sửa lịch hẹn này.' });
        }
        if (appointment.status !== 'Pending') {
            return res.status(400).json({ message: 'Chỉ có thể sửa lịch hẹn đang chờ xác nhận.' });
        }

        const affected = await Appointment.update(id, currentUser.id, targetExpertId, appointmentTime, note);
        if (!affected) {
            return res.status(404).json({ message: 'Không thể cập nhật lịch hẹn.' });
        }

        res.json({ message: 'Đã cập nhật lịch hẹn.' });
    } catch (error) {
        console.error('[Appointment] updateAppointment error:', error);
        res.status(500).json({ message: 'Lỗi server khi cập nhật lịch hẹn.' });
    }
};

// User xóa lịch hẹn
// DELETE /api/appointments/:id
exports.deleteAppointment = async (req, res) => {
    try {
        const currentUser = req.user;
        const id = parseInt(req.params.id, 10);

        if (!id) {
            return res.status(400).json({ message: 'Thiếu id lịch hẹn.' });
        }

        // Kiểm tra lịch hẹn có tồn tại và thuộc về user này không
        const appointment = await Appointment.getById(id);
        if (!appointment) {
            return res.status(404).json({ message: 'Không tìm thấy lịch hẹn.' });
        }
        if (appointment.user_id !== currentUser.id) {
            return res.status(403).json({ message: 'Bạn không có quyền xóa lịch hẹn này.' });
        }

        const affected = await Appointment.delete(id, currentUser.id);
        if (!affected) {
            return res.status(404).json({ message: 'Không thể xóa lịch hẹn.' });
        }

        res.json({ message: 'Đã xóa lịch hẹn.' });
    } catch (error) {
        console.error('[Appointment] deleteAppointment error:', error);
        res.status(500).json({ message: 'Lỗi server khi xóa lịch hẹn.' });
    }
};
