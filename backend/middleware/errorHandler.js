const { errorResponse } = require('../utils/responseHandler');

const errorHandler = (err, req, res, next) => {
  console.error('Server Error:', err.message);

  const statusCode = err.statusCode || 500;
  const message = process.env.NODE_ENV === 'production'
    ? 'Something went wrong. Please try again.'
    : err.message || 'Internal Server Error';

  return errorResponse(res, message, statusCode);
};

module.exports = errorHandler;
