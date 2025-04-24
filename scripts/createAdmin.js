const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/userModel');
const dotenv = require('dotenv');

dotenv.config();

mongoose.connect(process.env.MONGO_URI).then(async () => {
  const email = 'admin@mpcb.com';
  const plainPassword = 'Admin@123';

  // ❌ Delete old admin
  await User.deleteOne({ email });

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(plainPassword, salt);
  console.log('🔐 New Hashed Password:', hashedPassword);

  const adminUser = new User({
    firstName: 'Admin',
    lastName: 'User',
    email,
    password: hashedPassword,
    role: 'supervisor',
    isVerified: true,
  });

  await adminUser.save();
  console.log('✅ Admin user created:', email, '| Password:', plainPassword);
  process.exit();
}).catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
