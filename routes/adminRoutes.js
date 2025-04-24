const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/userModel');  // Assuming your User model is in 'models/userModel'


const Complaint = require('../models/complaintModel');

const ensureAdmin = require('../middleware/ensureAdmin');  // Assuming you have middleware for admin auth

// Admin dashboard (Show complaints and supervisors)
router.get('/dashboard', ensureAdmin, async (req, res) => {
  try {
    const complaints = await Complaint.find();
    const supervisors = await User.find({ role: 'supervisor' });
    const fieldOfficers = await User.find({ role: 'field' });
    const citizens = await User.find({ role: 'citizen' });
    // Count complaints based on their status
    const pendingCount = await Complaint.countDocuments({ status: 'pending' });
    const progressCount = await Complaint.countDocuments({ status: 'progress' });
    const completedCount = await Complaint.countDocuments({ status: 'completed' });
    const escalatedCount = await Complaint.countDocuments({ status: 'escalated' });
    const approvedCount = await Complaint.countDocuments({ status: 'approved' });

    // Count active and inactive supervisors
    const activeSupervisorsCount = await User.countDocuments({ role: 'supervisor'});

    const fieldOfficersCount = fieldOfficers.length;
    const citizensCount = citizens.length;
    
    res.render('admin/dashboard', { 
      user: req.session.user, 
      complaints, 
      supervisors,
      pendingCount,
      progressCount,
      completedCount,
      escalatedCount,
      approvedCount,
      activeSupervisorsCount,
      
      fieldOfficersCount,
      citizensCount
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching data');
  }
});
router.get('/complaints', ensureAdmin, async (req, res) => {
  try {
    const complaints = await Complaint.find();
    res.render('admin/complaints', { user: req.session.user, complaints });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching complaints');
  }
});


// Delete a complaint
router.get('/complaints/:id/delete', ensureAdmin, async (req, res) => {
  try {
    const complaint = await Complaint.findByIdAndDelete(req.params.id);
    res.redirect('/admin/complaints');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error deleting complaint');
  }
});

// Edit complaint
router.get('/complaints/:id/edit', ensureAdmin, async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);
    res.render('admin/editComplaint', { complaint });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching complaint');
  }
});

// Update complaint
router.post('/complaints/:id/edit', ensureAdmin, async (req, res) => {
  try {
    const { description, status } = req.body;
    const updatedComplaint = await Complaint.findByIdAndUpdate(req.params.id, { description, status });
    res.redirect('/admin/complaints');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error updating complaint');
  }
});

// Supervisors management
router.get('/supervisors', ensureAdmin, async (req, res) => {
  try {
    const supervisors = await User.find({ role: 'supervisor' });
    res.render('admin/supervisors', { supervisors });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching supervisors');
  }
});
// DELETE route
router.delete('/delete-user/:id', async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.status(200).send("Deleted");
});

// UPDATE route (POST version from edit modal)
router.post('/admin/update-user/:id', async (req, res) => {
  try {
    const { firstName, lastName, email, role } = req.body;
    const userId = req.params.id;
    console.log(userId);

    const updated = await User.findByIdAndUpdate(
      userId,
      { firstName, lastName, email, role },
      { new: true } // returns the updated document
    );

    if (!updated) {
      return res.status(404).send('User not found');
    }

    res.send('User updated successfully');
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

// Supervisors management
router.get('/field-officers', ensureAdmin, async (req, res) => {
    try {
        const fieldOfficers = await User.find({ role: 'field' });
        res.render('admin/field-officers', { fieldOfficers });
        
    } catch (err) {
      console.error(err);
      res.status(500).send('Error fetching supervisors');
    }
  });
router.get('/login', (req, res) => {
    res.render('admin/login', { errorMessage: null }); // Pass errorMessage as null initially
  });
  
  // Login logic (POST request)
  router.post('/login', async (req, res) => {
    const { email, password } = req.body;
  
    try {
      const user = await User.findOne({ email: email });
      if (!user) {
        return res.render('admin/login', { errorMessage: 'Invalid credentials' });
      }
  
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.render('admin/login', { errorMessage: 'Invalid credentials' });
      }
  
      // Store user session
      req.session.user = user;
  
      // Redirect to dashboard
      res.redirect('/admin/dashboard');
    } catch (error) {
      console.error(error);
      res.render('admin/login', { errorMessage: 'An error occurred, please try again' });
    }
  });
  

// Logout route
router.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.log(err);
      return res.redirect('/admin/dashboard');
    }
    res.clearCookie('connect.sid');
    res.redirect('/admin/login');
  });
});
// GET Settings Page
// GET Settings Page with dynamic user table
router.get('/settings', ensureAdmin, async (req, res) => {
  const searchQuery = req.query.search || '';  // Search query (if any)
  const currentPage = parseInt(req.query.page) || 1;  // Current page (default to 1)
  const itemsPerPage = 10;  // Number of items per page

  try {
    const query = searchQuery ? { $or: [{ firstName: { $regex: searchQuery, $options: 'i' } }, { lastName: { $regex: searchQuery, $options: 'i' } }, { email: { $regex: searchQuery, $options: 'i' } }] } : {};
    const totalUsers = await User.countDocuments(query);  // Total number of users matching the search query
    const totalPages = Math.ceil(totalUsers / itemsPerPage);  // Calculate total pages

    // Get users for the current page
    const users = await User.find(query)
      .skip((currentPage - 1) * itemsPerPage)
      .limit(itemsPerPage);

    res.render('admin/settings', {
      user: req.session.user,
      users,
      searchQuery,
      currentPage,
      totalPages
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching users');
  }
});

// POST route to create new users
router.post('/create-user', ensureAdmin, async (req, res) => {
  const { firstName, lastName, email, password, role } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role
    });

    await newUser.save();
    res.redirect('/admin/settings');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error creating user');
  }
});

module.exports = router;
