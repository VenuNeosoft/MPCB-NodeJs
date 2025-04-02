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
      
            next();
          } catch (error) {
            console.error('Auth Error:', error);
            res.status(401).json({ message: 'Unauthorized: Invalid token' });
          }
        }
      
        if (!token) {
          return res.status(401).json({ message: 'Unauthorized: No token provided' });
        }
      };
    const fieldUserProtect = async (req, res, next) => {
    protect(req, res, async () => {
        if (req.user.role === 'field') {
        next();
        } else {
        res.status(403).json({ message: 'Access denied, not a Field User' });
        }
    });
    };
    const supervisorProtect = async (req, res, next) => {
        try {
          if (!req.headers.authorization) {
            return res.status(401).json({ message: 'No token, authorization denied' });
          }
      
          // Extract token
          const token = req.headers.authorization.split(' ')[1];
          if (!token) {
            return res.status(401).json({ message: 'Token missing' });
          }
      
          // Verify token
          const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
          // Fetch user from DB
          const user = await User.findById(decoded.id);
      
          if (!user) {
            return res.status(404).json({ message: 'User not found' });
          }
      
          console.log('User Role:', user.role);  // ✅ Debugging line
      
          if (user.role !== 'supervisor') {
            return res.status(403).json({ message: 'Access denied: Supervisors only' });
          }
      
          req.user = user;
          next();
        } catch (error) {
          res.status(401).json({ message: 'Unauthorized', error });
        }
      };
      
    module.exports = { protect, fieldUserProtect, supervisorProtect };
