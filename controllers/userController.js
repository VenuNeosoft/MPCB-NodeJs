// controllers/userController.js
const User = require('../models/userModel');

// @desc Get all users
// @route GET /api/users
const getFieldUsers = async (req, res) => {
  try {
    const fieldUsers = await User.find({ role: 'field' });

    if (fieldUsers.length === 0) {
      return res.status(404).json({ message: 'No field users found' });
    }

    res.status(200).json({
      status: 'success',
      message: 'Field users retrieved successfully',
      body: fieldUsers,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching field users', error });
  }
};
const getSupervisors = async (req, res) => {
  try {
    const supervisors = await User.find({ role: 'supervisor' });

    if (supervisors.length === 0) {
      return res.status(404).json({ message: 'No supervisors found' });
    }

    res.status(200).json({
      status: 'success',
      message: 'Supervisors retrieved successfully',
      body: supervisors,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching supervisors', error });
  }
};

module.exports = {
  getFieldUsers,
  getSupervisors,
};