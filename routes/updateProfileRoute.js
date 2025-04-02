const express = require('express');
const {protect} = require('../middleware/authMiddleware');
const updateProfile = require('../controllers/updateProfileController');

const router = express.Router();

// PUT /api/users/updateprofile
router.put('/updateprofile',protect, updateProfile);

module.exports = router;
