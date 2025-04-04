const express = require('express');
const {
  sendPasswordResetOtp,
  resetPassword,
} = require('../controllers/forgotPasswordController');

const router = express.Router();

router.post('/forgot-password', sendPasswordResetOtp);
router.post('/reset-password', resetPassword);

module.exports = router;
