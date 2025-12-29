const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const userProfileController = require('../controllers/userProfileController');

// Cấu hình multer để upload avatar
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/avatars/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'avatar-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|gif|webp/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);
        if (extname && mimetype) {
            return cb(null, true);
        }
        cb(new Error('Chỉ chấp nhận file ảnh (jpeg, jpg, png, gif, webp)'));
    }
});

// GET /api/profiles/:userId
router.get('/:userId', userProfileController.getProfile);

// PUT /api/profiles/:userId
router.put('/:userId', userProfileController.updateProfile);

// POST /api/profiles/:userId/avatar - Upload avatar
router.post('/:userId/avatar', upload.single('avatar'), userProfileController.uploadAvatar);

module.exports = router;