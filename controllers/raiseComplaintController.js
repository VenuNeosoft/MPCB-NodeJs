const Complaint = require('../models/complaintModel');
const Notification = require('../models/notificationModel');
const admin = require('../firebase');
const notificationController = require('../controllers/notificationController'); // Rename import

// @desc Raise a complaint
// @route POST /api/complaints/raise
const raiseComplaint = async (req, res) => {
  const { title, description, citizen, serviceName, issueName, supervisorId } = req.body;

  if (!title || !description || !citizen || !supervisorId) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  let citizenImage = '';
  if (req.file) {
    citizenImage = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;

  }

  try {
    const complaint = await Complaint.create({
      title,
      description,
      citizen,
      citizenImage,
      serviceName,
      issueName,


      fieldUserImage: '',
      assignedTo: supervisorId,
      assignedRole: 'supervisor',
      status: 'pending',
      response: '',
    });
 
    await notificationController.createNotification(citizen, `New complaint created: "${title}"`);
    await notificationController.createNotification(supervisorId, `New complaint assigned: "${title}"`);

    res.status(201).json({
      message: 'Complaint raised successfully',
      complaint,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = raiseComplaint;
