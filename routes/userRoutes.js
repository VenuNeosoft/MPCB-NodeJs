const express = require('express');
const router = express.Router();
const { getFieldUsers } = require('../controllers/userController'); // Import the controller

// Get list of all field users
router.get('/field', getFieldUsers);

module.exports = router;
