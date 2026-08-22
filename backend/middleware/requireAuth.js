const { errorResponse } = require('../utils/responseHandler');

const requireAuth = (req, res, next) => {
  if (!req.session || !req.session.userId) {
    return errorResponse(res, 'Authentication required.', 401);
  }
  next();
};

module.exports = requireAuth;
