const User = require('../models/userModel');

// @desc Delete user by ID
// @route DELETE /api/users/:id
const deleteUser = async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404).json({ message: 'User not found' });
    return;
  }

  await user.deleteOne();
  res.json({ message: 'User removed' });
};

module.exports = deleteUser;
