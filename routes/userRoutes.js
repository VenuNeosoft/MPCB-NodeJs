const express = require('express');
const router = express.Router();
const { getFieldUsers, getSupervisors } = require('../controllers/userController'); // Import the controller

// Get list of all field users
router.get('/field', getFieldUsers);
router.get('/supervisors', getSupervisors);

module.exports = router;
