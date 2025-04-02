// controllers/userController.js
const User = require('../models/userModel');

// @desc Get all users
// @route GET /api/users
const getFieldUsers = async (req, res) => {
  try {
    // Find all users with the role 'field'
    const fieldUsers = await User.find({ role: 'field' });

    // If no field users are found
    if (fieldUsers.length === 0) {
      return res.status(404).json({ message: 'No field users found' });
    }

    // Return the list of field users
    res.status(500).json({
      status: 'success',  // You can use success as a status message
      message: 'field users  retrieved successfully',
      body: fieldUsers,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching field users', error });
  }
};

module.exports = {
  
  getFieldUsers
};
