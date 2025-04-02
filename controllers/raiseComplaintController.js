const Complaint = require('../models/complaintModel');

// @desc Raise a complaint
// @route POST /api/complaints/raise
const raiseComplaint = async (req, res) => {
  const { title, description, citizen,serviceName,issueName,filedUserId } = req.body;

  if (!title || !description || !citizen) {
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
      assignedTo: filedUserId,
      status: 'pending',
      response: '',
    });

    res.status(201).json({
      message: 'Complaint raised successfully',
      complaint,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = raiseComplaint;
