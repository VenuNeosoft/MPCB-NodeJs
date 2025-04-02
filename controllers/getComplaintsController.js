const Complaint = require('../models/complaintModel');

// @desc Get all complaints
// @route GET /api/complaints
// @access Private (Field User or Supervisor)
const getComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find()
      .populate('citizen', 'name email')
      .populate('assignedTo', 'name email');

    res.status(200).json({
      status: 'success',
      message: 'All complaints retrieved successfully',
      body: complaints,
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Error fetching complaints', error });
  }
};

// @desc Get complaints assigned to the logged-in field officer
// @route GET /api/complaints/assigned
// @access Private (Field Officer)
const getAssignedComplaints = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Unauthorized: No user ID provided" });
    }

    // Fetch complaints where assignedTo matches the logged-in user's ID
    const complaints = await Complaint.find({ assignedTo: req.user.id })
      .populate('citizen', 'name email')
      .populate('assignedTo', 'name email');

    res.status(200).json({
      status: 'success',
      message: 'Assigned complaints retrieved successfully',
      body: complaints,
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Error fetching assigned complaints', error });
  }
};

module.exports = { getComplaints, getAssignedComplaints };
