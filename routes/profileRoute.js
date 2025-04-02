const express = require('express');
const { getUserProfile } = require('../controllers/getProfileController');
const {protect} = require('../middleware/authMiddleware');

const router = express.Router();

// Correct: router.get requires a callback function
router.get('/profile',protect, getUserProfile);

module.exports = router;
