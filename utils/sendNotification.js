const Notification = require('../models/notificationModel');

const sendNotification = async ({ userId, complaintId, title, message }) => {
  try {
    await Notification.create({ userId, complaintId, title, message });
  } catch (err) {
    console.error('Error sending notification:', err.message);
  }
};

module.exports = sendNotification;
