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
      },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'completed'],
      default: 'pending',
    },
    response: {
      type: String,
      default: '',
    },
   
  },
  { timestamps: true }
);

const Complaint = mongoose.model('Complaint', complaintSchema);

module.exports = Complaint;
