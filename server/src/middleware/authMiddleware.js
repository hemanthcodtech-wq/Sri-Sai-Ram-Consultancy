const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'ssrc_super_secret_jwt_key_2026_secure'
      );
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        // Fallback for demo admin token if user was wiped or local test
        if (decoded.email === 'admin@ssrc.com') {
          req.user = {
            id: decoded.id,
            name: 'Sri Sai Ram Admin',
            email: 'admin@ssrc.com',
            role: 'admin',
          };
          return next();
        }
        return res.status(401).json({ success: false, message: 'User not found' });
      }

      next();
    } catch (error) {
      console.error('Auth token error:', error.message);
      return res.status(401).json({ success: false, message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized, no token provided' });
  }
};

module.exports = { protect };
