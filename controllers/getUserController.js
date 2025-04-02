const User = require('../models/userModel');

// @desc Get all users
// @route GET /api/users
const getUsers = async (req, res) => {
  const users = await User.find();
  res.json(users);
};

module.exports = getUsers;
