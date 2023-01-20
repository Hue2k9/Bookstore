const jwt = require('jsonwebtoken');
const jwt_decode = require('jwt-decode');
const { User } = require('./../models');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('../utils/AppError');
const promisify = require('promisify');
const util = require('util');
require('util.promisify').shim();

const protect = catchAsync(async (req, res, next) => {
  // 1) Getting token and check of it's there
  let token = '';
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new AppError('You are not logged in! Please log in to get access.', 401));
  }

  // 2) Verification token
  const decoded = await jwt_decode(token, process.env.TOKEN_SECRET);
  console.log(decoded);
  // 3) Check if user still exists
  const currentUser = await User.findById(decoded.id);
  console.log(currentUser);
  if (!currentUser) {
    return next(new AppError('The user belonging to this token does no longer exist.', 401));
  }

  // GRANT ACCESS TO PROTECTED ROUTE
  req.user = currentUser;
  next();
});

const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError('You do not have permission to perform this action', 403));
    }

    next();
  };
};

module.exports = {
  protect,
  restrictTo,
};
