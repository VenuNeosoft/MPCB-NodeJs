const express = require('express');
const deleteUser = require('../controllers/deleteUserController');

const router = express.Router();

// Delete user by ID route
router.delete('/delete/:id', deleteUser);

module.exports = router;
