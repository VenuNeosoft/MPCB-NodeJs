const User = require('../models/userModel');
const TempUser = require('../models/tempUserModel');
const { sendOtpEmail } = require('../utils/emailService');
const bcrypt = require('bcryptjs');

// 1. Send OTP for password reset
const sendPasswordResetOtp = async (req, res) => {
  const { email } = req.body;

  if (!email) return res.status(400).json({ message: 'Email is required' });

  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: 'User not found' });

  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  await TempUser.findOneAndUpdate(
    { email },
    { otp, otpExpires: Date.now() + 10 * 60 * 1000 }, // 10 min expiry
    { upsert: true, new: true }
  );

  await sendOtpEmail(email, otp);

  res.status(200).json({ message: 'OTP sent to email for password reset', otp });
};

// 2. Verify OTP and reset password
const resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  if (!email || !otp || !newPassword) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const tempUser = await TempUser.findOne({ email });
  if (!tempUser || tempUser.otp !== otp || tempUser.otpExpires < Date.now()) {
    return res.status(400).json({ message: 'Invalid or expired OTP' });
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await User.findOneAndUpdate({ email }, { password: hashedPassword });

  await TempUser.deleteOne({ email });

  res.status(200).json({ message: 'Password reset successfully' });
};

module.exports = {
  sendPasswordResetOtp,
  resetPassword,
};
