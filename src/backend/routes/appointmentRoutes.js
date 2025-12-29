const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');
const { protect } = require('../middlewares/authMiddleware');

// Tất cả API lịch hẹn đều yêu cầu đăng nhập
router.use(protect);

// Tạo lịch hẹn
router.post('/', appointmentController.createAppointment);

// Lấy lịch hẹn của user/doctor hiện tại
router.get('/mine', appointmentController.getMyAppointments);

// Bác sĩ cập nhật trạng thái
router.patch('/:id/status', appointmentController.updateStatus);

// User cập nhật lịch hẹn
router.put('/:id', appointmentController.updateAppointment);

// User xóa lịch hẹn
router.delete('/:id', appointmentController.deleteAppointment);

module.exports = router;
