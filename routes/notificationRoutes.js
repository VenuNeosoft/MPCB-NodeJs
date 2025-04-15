const express = require('express');
const {
  createNotification,
  getUserNotifications,
  markAsRead,
  deleteNotification,
} = require('../controllers/notificationController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/create-notification', protect, createNotification);
router.get('/get-notification', protect, getUserNotifications);
router.put('/:id/read', protect, markAsRead);
router.delete('/:id', protect, deleteNotification);

module.exports = router;
