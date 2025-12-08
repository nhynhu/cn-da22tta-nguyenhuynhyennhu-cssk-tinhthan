const express = require('express');
const router = express.Router();
const userProfileController = require('../controllers/userProfileController');

// GET /api/profiles/:userId
router.get('/:userId', userProfileController.getProfile);

// PUT /api/profiles/:userId
router.put('/:userId', userProfileController.updateProfile);

module.exports = router;