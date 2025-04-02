const User = require('../models/userModel');

// @desc Update user profile
// @route PUT /api/users/updateprofile
// @access Private
const updateProfile = async (req, res) => {

  if (!req.user || !req.user.id) {
    return res.status(401).json({ message: "Unauthorized: No user ID provided" });
  }
  const user = await User.findById(req.user.id).select('-password');

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  // Update fields only if provided in the request body
  user.name = req.body.name || user.name;
  user.email = req.body.email || user.email;


  const updatedUser = await user.save();

  res.json({
    _id: updatedUser.id,
    name: updatedUser.name,
    email: updatedUser.email,
    message: 'Profile updated successfully',
  });
};

module.exports = updateProfile;
