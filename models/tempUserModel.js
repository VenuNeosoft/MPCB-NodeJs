const mongoose = require('mongoose');

const tempUserSchema = mongoose.Schema({
  firstName: String,
  lastName:String,
  email: { type: String, required: true, unique: true },
  password: String,
  role: String,
  otp: String,
  otpExpires: Date,
}, { timestamps: true });

const TempUser = mongoose.model('TempUser', tempUserSchema);
module.exports = TempUser;
