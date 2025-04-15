const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization && 
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Extract token
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach user to request (excluding password)
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(401).json({ message: 'User not found' });
      }

      return next();
    } catch (error) {
      console.error('Auth Error:', error);
      return res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }
  }

  // Token not found
  return res.status(401).json({ message: 'Unauthorized: No token provided' });
};
const fieldUserProtect = async (req, res, next) => {
  await protect(req, res, async () => {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized: No user found' });
    }

    if (req.user.role === 'field') {
      return next();
    } else {
      return res.status(403).json({ message: 'Access denied, not a Field User' });
    }
  });
};

const supervisorProtect = async (req, res, next) => {
  await protect(req, res, async () => {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized: No user found' });
    }

    if (req.user.role === 'supervisor') {
      return next();
    } else {
      return res.status(403).json({ message: 'Access denied: Supervisors only' });
    }
  });
};

    module.exports = { protect, fieldUserProtect, supervisorProtect };
