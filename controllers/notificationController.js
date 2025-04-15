const Notification = require('../models/notificationModel');
const admin = require('../firebase');
const User = require('../models/userModel'); 
// Create a new notification
const createNotification = async (user, message, deviceToken = null) => {
  if (!user || !message) {
    throw new Error('User ID and message are required');
  }

  try {
    // Create the notification in the database
    const notification = await Notification.create({
      user,
      message,
    });
   
    if (deviceToken == null) {
      const userRecord = await User.findById(user);
      deviceToken = userRecord.deviceToken;
      console.log('Fetched deviceToken from database:', deviceToken);  // Debug log
    }
    console.log(deviceToken);
   

    if (deviceToken) {
      // Send FCM notification if device token is available
      const payload = {
        notification: {
          title: 'New Notification',
          body: message,
        },
        token: deviceToken,
      };
      await admin.messaging().send(payload);
    }

    return notification;
  } catch (error) {
console.log(error.message);
    throw new Error(error.message);
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
