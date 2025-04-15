const Complaint = require('../models/complaintModel');
const Notification = require('../models/notificationModel');
const notificationController = require('../controllers/notificationController'); // Rename import

// @desc Supervisor assigns a complaint to a field user
// @route PUT /api/complaints/assign-to-field/:id
// @access Protected (Supervisor only)
const assignToFieldUser = async (req, res) => {
  const complaintId = req.params.id;
  const { fieldUserId } = req.body;

  if (!fieldUserId) {
    return res.status(400).json({ message: 'Field user ID is required' });
  }

  try {
    const complaint = await Complaint.findById(complaintId);

    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    // Optional: Check if current assignedRole is supervisor
    // if (complaint.assignedRole !== 'supervisor' ||complaint.assignedRole !== 'field') {
    //   return res.status(400).json({ message: 'Complaint is not assigned to a supervisor' });
    // }

    // Update assignment to field user
    complaint.assignedTo = fieldUserId;
    complaint.assignedRole = 'field';
    complaint.status = 'progress'; // Or whatever status you prefer
    await complaint.save();
    await notificationController.createNotification(
         complaint.assignedTo,
      `This complaint "${complaint.title}" assigned to you. now its in "${complaint.status}"`,
      );
      await notificationController.createNotification(
     complaint.citizen,
    `This complaint "${complaint.title}" assigned to field oficer. field officer will visit and resolve your issue. Thank you"`,
      );
    res.status(200).json({
      message: 'Complaint assigned to field user successfully',
      complaint,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { assignToFieldUser };
