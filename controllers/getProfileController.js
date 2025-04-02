const User = require('../models/userModel');

// @desc Get user profile
// @route GET /api/users/profile
// @access Private
const getUserProfile = async (req, res) => {

  try {
    console.log("Request User:", req.user); // Debugging

    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Unauthorized: No user ID provided" });
    }
    const user = await User.findById(req.user.id).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching profile', error });
  }
};

module.exports = { getUserProfile };
