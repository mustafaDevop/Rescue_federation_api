const httpStatus = require('http-status');
const config = require('../config/auth');
const logger = require('../config/logger');
const ApiError = require('../utils/ApiError');

// Convert any error to an instance of ApiError
const errorConverter = (err, req, res, next) => {
  let error = err;

  if (!(error instanceof ApiError)) {
    const statusCode =
      error.statusCode ||
      (error.name === 'ValidationError' ? httpStatus.BAD_REQUEST : httpStatus.INTERNAL_SERVER_ERROR);
    const message = error.message || httpStatus[statusCode];

    // Ensure ApiError gets proper arguments
    error = new ApiError(message, statusCode, statusCode, err.stack);
  }

  next(error);
};

// Send error as JSON response
const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || httpStatus[statusCode];

  // Log errors in production
  if (config.env === 'production') {
    logger.error(err);
  } else {
  }

  res.status(statusCode).json({
    success: false,
    code: statusCode,
    message,
    // Include stack trace only in dev
    ...(config.env !== 'production' && { stack: err.stack }),
  });
};

module.exports = {
  errorConverter,
  errorHandler,
};
