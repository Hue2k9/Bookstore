const httpStatus = require('http-status');
const userService = require('./user.service');
const AppError = require('../utils/AppError');
const { verify } = require('crypto');

/**
 * Login with username and password
 * @param {string} email
 * @param {string} password
 * @returns {Promise<User>}
 */
const loginUser = async (email, password) => {
  const user = await userService.getUserByEmail(email);
 
  if (!user || !(await user.isPasswordMatch(password))) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Incorrect email or password');
  }
  return user;
};

module.exports = {
  loginUser,
};
