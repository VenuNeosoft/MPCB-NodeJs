const mongoose = require('mongoose');

const complaintSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    serviceName: {
        type: String,
    
      },
      issueName: {
        type: String,
    
      },
    citizen: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Reference to Citizen who raised the complaint
      required: true,
    },
    citizenImage: {
        type: String, // Issue image uploaded by the citizen
        default: '',
      },
      fieldUserImage: {
        type: String, // Updated image by field user
        default: '',
      },
      assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Field user assigned to complaint
        required: true,
      },
      assignedRole: {
        type: String,
        enum: ['field', 'supervisor'],
        required: true,
      },
    status: {
      type: String,
      enum: ['pending', 'approved', 'escalated', 'completed','progress'],
      default: 'pending',
    },
    progressImages: [{ type: String }],
completedImages: [{ type: String }],
escalatedImages: [{ type: String }],

    response: {
      type: String,
      default: '',
    },
   
  },
  { timestamps: true }
);

const Complaint = mongoose.model('Complaint', complaintSchema);

module.exports = Complaint;
