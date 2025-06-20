

const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

// Middleware to protect routes - requires valid JWT and user in DB
exports.protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Not authenticated, token missing' });
    }

    const token = authHeader.split(' ')[1];

    // Verify token with secret, fallback to 'dev' if no env var set (for dev purposes)
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev');

    // Find user by ID from token payload
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    // Attach user object to request
    req.user = user;

    next();
  } catch (error) {
    console.error('JWT verification error:', error);
    res.status(401).json({ message: 'Invalid or expired token', error: error.message });
  }
};

// Middleware to restrict access by user roles
exports.restrictTo = (...allowedRoles) => (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Not authenticated' });
  }

  if (!allowedRoles.includes(req.user.role)) {
    return res.status(403).json({ message: 'Access forbidden: insufficient permissions' });
  }

  next();
};
