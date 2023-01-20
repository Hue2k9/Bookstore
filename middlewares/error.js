const mongoose = require('mongoose');
const httpStatus = require('http-status');
const { env } = require('../config/vars');
const logger = require('../config/logger');
const AppError = require('../utils/AppError');

const errorConverter = (err, req, res, next) => {
  let error = err;
  if (!(error instanceof AppError)) {
    const statusCode =
      error.statusCode || error instanceof mongoose.Error ? httpStatus.BAD_REQUEST : httpStatus.INTERNAL_SERVER_ERROR;

    const message = error.message || httpStatus[statusCode];
    error = new AppError(statusCode, message, false, err.stack);
  }
  next(error);
};

// eslint-disable-next-line no-unused-vars
const globalErrorHandler = (err, req, res, next) => {
  let { statusCode, message } = err;
  if (env === 'production' && !err.isOperational) {
    statusCode = httpStatus.INTERNAL_SERVER_ERROR;
    message = httpStatus[httpStatus.INTERNAL_SERVER_ERROR];
  }

  res.locals.errorMessage = err.message;

  const response = {
    code: statusCode,
    message,
    ...(env === 'development' && { stack: err.stack }),
  };

  if (env === 'development') {
    logger.error(err);
  }

  res.status(statusCode).send(response);
};

module.exports = {
  errorConverter,
  globalErrorHandler,
};
