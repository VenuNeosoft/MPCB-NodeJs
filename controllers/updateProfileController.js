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
  user.firstName = req.body.firstName || user.firstName;
  user.lastName = req.body.lastName || user.lastName;
  
  user.email = req.body.email || user.email;


  const updatedUser = await user.save();
  await Notification.create({
    user: user.id,
    message: `Your profile has been updated successfully`,
  });
  res.json({
    _id: updatedUser.id,
    firstName: updatedUser.firstName,
    lastName: updatedUser.lastName,
    email: updatedUser.email,
    message: 'Profile updated successfully',
  });
};

module.exports = updateProfile;
