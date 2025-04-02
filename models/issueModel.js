// models/issueModel.js
const mongoose = require('mongoose');

const issueSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  serviceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service',  // Reference to Service model
    required: true,
  },
});

const Issue = mongoose.model('Issue', issueSchema);

module.exports = Issue;
