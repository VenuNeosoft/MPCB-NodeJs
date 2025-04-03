const express = require('express');
const {createUser,verifyOtp} = require('../controllers/createUserController');

const router = express.Router();

router.post('/create', createUser);
router.post('/verify-otp', verifyOtp);
module.exports = router;
