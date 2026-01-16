const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

// GET /api/admin/stats - Lấy thống kê
router.get('/stats', adminController.getStats);

module.exports = router;
