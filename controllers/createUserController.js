const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const {sendOtpEmail} = require('../utils/emailService');
const TempUser = require('../models/tempUserModel'); 
// @desc Generate JWT Token for Authentication
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '1095d', // 3 years token validity
  });
};

// @desc Create new user with role
// @route POST /api/users
const createUser = async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password || !role) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const validRoles = ['citizen', 'field', 'supervisor'];
  if (!validRoles.includes(role)) {
    return res.status(400).json({ message: 'Invalid role' });
  }

  // Check if user already exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({ message: 'User already exists' });
  }

  // Generate OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  // Store in temporary collection instead of creating the user
  await TempUser.findOneAndUpdate(
    { email },
    { name, email, password, role, otp, otpExpires: Date.now() + 10 * 60 * 1000 },
    { upsert: true, new: true }
  );

  // Send OTP email
  await sendOtpEmail(email, otp);

  res.status(201).json({ message: 'OTP sent. Please verify to complete registration.',otp:otp });
};

// Verify OTP and activate user
const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  const tempUser = await TempUser.findOne({ email });

  if (!tempUser) {
    return res.status(400).json({ message: 'User not found or OTP expired' });
  }

  if (tempUser.otp !== otp || tempUser.otpExpires < Date.now()) {
    return res.status(400).json({ message: 'Invalid or expired OTP' });
  }

  // Create user in actual collection
  const user = await User.create({
    name: tempUser.name,
    email: tempUser.email,
    password: tempUser.password,
    role: tempUser.role,
    isVerified: true,
  });

  // Remove temp user entry
  await TempUser.deleteOne({ email });

  // Generate token
  const token = generateToken(user._id);

  res.status(200).json({
    _id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    token,
  });
};
module.exports = { createUser, verifyOtp };
