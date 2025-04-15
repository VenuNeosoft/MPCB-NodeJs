const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '30d',
  });
};

// @desc Login user and get token
// @route POST /api/users/login
const loginUser = async (req, res) => {
  const { email, password, role, deviceToken } = req.body;

  if (!email || !password || !role) {
    res.status(400).json({ message: 'All fields are required' });
    return;
  }

  const user = await User.findOne({ email });
  if (!user || user.role !== role) {
    res.status(401).json({ message: 'Invalid email or role mismatch' });
    return;
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (isMatch) {
    // Update the deviceToken when the user logs in
    if (deviceToken) {
      user.deviceToken = deviceToken;
      await user.save();
    }

    const token = generateToken(user._id);

    res.json({
      status: 'Success',
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      token,
    });
  } else {
    res.status(401).json({ message: 'Invalid email or password' });
  }
};

module.exports = loginUser;
