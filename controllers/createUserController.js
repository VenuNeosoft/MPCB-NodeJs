const User = require('../models/userModel');
const jwt = require('jsonwebtoken');

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

  // Check if all fields are provided
  if (!name || !email || !password || !role) {
    res.status(400).json({ message: 'All fields are required' });
    return;
  }

  // Validate allowed roles
  const validRoles = ['citizen', 'field', 'supervisor'];
  if (!validRoles.includes(role)) {
    res.status(400).json({ message: 'Invalid role specified' });
    return;
  }

  // Check if user already exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400).json({ message: 'User already exists' });
    return;
  }

  // Create a new user with role
  const user = await User.create({
    name,
    email,
    password,
    role, // Add role to the user
  });

  if (user) {
    // Generate token and return response
    const token = generateToken(user._id);

    res.status(201).json({
      _id: user.id,
      name: user.name,
      email: user.email,
      role: user.role, // Return role in response
      token,
    });
  } else {
    res.status(400).json({ message: 'Failed to create user' });
  }
};

module.exports = createUser;
