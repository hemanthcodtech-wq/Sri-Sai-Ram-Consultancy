const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../models/User');
const store = require('../config/store');

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      if (!token) {
        return res.status(401).json({ success: false, message: 'Not authorized, token missing' });
      }

      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'ssrc_super_secret_jwt_key_2026_secure'
      );

      // Check MongoDB if connected and decoded id is a valid Mongo ObjectId
      if (store.isMongo() && decoded.id && mongoose.Types.ObjectId.isValid(decoded.id)) {
        try {
          const dbUser = await User.findById(decoded.id).select('-password');
          if (dbUser) {
            req.user = dbUser;
            return next();
          }
        } catch (dbErr) {
          console.warn('DB lookup error in authMiddleware, checking store fallback:', dbErr.message);
        }
      }

      // Check fallback store
      const storeUsers = store.data?.users || [];
      const foundInStore = storeUsers.find(
        (u) =>
          u._id === decoded.id ||
          (u.email && decoded.email && u.email.toLowerCase() === decoded.email.toLowerCase())
      );

      if (foundInStore) {
        req.user = {
          _id: foundInStore._id,
          name: foundInStore.name,
          email: foundInStore.email,
          role: foundInStore.role || 'admin',
        };
        return next();
      }

      // Standard admin fallback for valid signed admin token
      if (decoded.email === 'admin@ssrc.com' || decoded.role === 'admin') {
        req.user = {
          _id: decoded.id || 'usr-admin-01',
          name: 'Sri Sai Ram Admin',
          email: decoded.email || 'admin@ssrc.com',
          role: 'admin',
        };
        return next();
      }

      return res.status(401).json({ success: false, message: 'User not authorized' });
    } catch (error) {
      console.error('Auth token verification error:', error.message);
      return res.status(401).json({ success: false, message: 'Not authorized, token failed' });
    }
  }

  return res.status(401).json({ success: false, message: 'Not authorized, no Bearer token provided' });
};

module.exports = { protect };

