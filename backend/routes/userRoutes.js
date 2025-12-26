const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { protect } = require('../middlewares/authMiddleware');

router.post('/register', userController.register);
router.post('/login', userController.login);
router.post('/google-login', userController.googleLogin);
router.post('/check-email', userController.checkEmail);
router.post('/reset-password', userController.resetPassword);
router.get('/doctors', userController.getDoctors);

// Admin routes (cần đăng nhập)
router.get('/all', protect, userController.getAllUsers);
router.post('/create', protect, userController.createUser);
router.patch('/:id/role', protect, userController.updateUserRole);
router.delete('/:id', protect, userController.deleteUser);

module.exports = router;