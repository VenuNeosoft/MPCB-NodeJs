const Complaint = require('../models/complaintModel');
const Notification = require('../models/notificationModel');
const notificationController = require('../controllers/notificationController'); 
// @desc Update complaint status and add fieldUser image
// @route PUT /api/complaints/:id
// @access Private (Only the assigned field officer can update)
const updateComplaint = async (req, res) => {
  const { status, response } = req.body;
  const complaintId = req.params.id;

  try {
    const complaint = await Complaint.findById(complaintId);

    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    if (!complaint.assignedTo || complaint.assignedTo.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Forbidden: Not assigned to you' });
    }

    complaint.status = status || complaint.status;
    complaint.response = response || complaint.response;

    // Handle multiple images
    if (req.files && req.files.length > 0) {
      const imagePaths = req.files.map(file => `${req.protocol}://${req.get('host')}/uploads/${file.filename}`);

      if (status === 'progress') {
        complaint.progressImages.push(...imagePaths);
      } else if (status === 'completed') {
        complaint.completedImages.push(...imagePaths);
      } else if (status === 'escalated') {
        complaint.escalatedImages.push(...imagePaths);
      }
    }

    const updatedComplaint = await complaint.save();
    await notificationController.createNotification(
   complaint.citizen,
     `Your complaint "${complaint.title}" status updated to "${complaint.status}"`,
    );
    
    res.status(200).json({
      message: 'Complaint updated successfully',
      complaint: updatedComplaint,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating complaint', error });
  }
};

const updateComplaintBySupervisor = async (req, res) => {
  const { status, response } = req.body;
  const complaintId = req.params.id;

  try {
    const complaint = await Complaint.findById(complaintId);

    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    // ✅ Supervisor can update any complaint
    complaint.status = status || complaint.status;
    complaint.response = response || complaint.response;

    // Check if Supervisor uploaded an image
    if (req.file) {
      complaint.fieldUserImage = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    }

    // Save updated complaint
    const updatedComplaint = await complaint.save();

    res.status(200).json({
      message: 'Complaint updated successfully by Supervisor',
      complaint: updatedComplaint,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating complaint', error });
  }
};

module.exports = {updateComplaint,updateComplaintBySupervisor};
