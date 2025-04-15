const Notification = require('../models/notificationModel');

// Create a new notification
const createNotification = async (req, res) => {
    const {  user, message } = req.body;
  
    if (( !user) || !message) {
      return res.status(400).json({ message: 'User ID and message are required' });
    }
  
    try {
      const notification = await Notification.create({
        user: user,
        message,
      });
      res.status(201).json({ message: 'Notification created', notification });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
// Get all notifications for the logged-in user
const getUserNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user._id }).sort({ createdAt: -1 });
    console.log('Looking for notifications with user:', req.user._id);

    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Mark a notification as read
const markAsRead = async (req, res) => {
  const { id } = req.params;
  try {
    const notification = await Notification.findById(id);
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }
    notification.read = true;
    await notification.save();
    res.status(200).json({ message: 'Notification marked as read', notification });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a notification
const deleteNotification = async (req, res) => {
  const { id } = req.params;
  try {
    const notification = await Notification.findByIdAndDelete(id);
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }
    res.status(200).json({ message: 'Notification deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createNotification,
  getUserNotifications,
  markAsRead,
  deleteNotification,
};
