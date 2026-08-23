const jwt = require('jsonwebtoken');
const { errorResponse } = require('../utils/responseHandler');

const JWT_SECRET = process.env.SESSION_SECRET || 'fallback-dev-secret';

const requireAuth = (req, res, next) => {
  // 1. Check session cookie
  if (req.session && req.session.userId) {
    return next();
  }

  // 2. Fallback: check JWT in Authorization header
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    try {
      const decoded = jwt.verify(authHeader.slice(7), JWT_SECRET);
      req.session.userId = decoded.userId;
      return next();
    } catch {}
  }

  return errorResponse(res, 'Authentication required.', 401);
};

module.exports = requireAuth;
