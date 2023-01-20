const httpStatus = require('http-status');
const crypto = require('crypto');
const catchAsync = require('../utils/catchAsync');
const { authService, userService, emailService } = require('../services');
const AppError = require('../utils/AppError');
const e = require('express');

/**
 * Register with email and password
 * @param {string} email
 * @param {string} password
 * @param {string} name
 * @returns {Promise<User>}
 */
const register = catchAsync(async (req, res) => {
  const user = await userService.createUser(req.body);

  const accessToken = await user.signToken();

  let { email } = req.body;

  let code = crypto.randomBytes(32).toString('hex');
  let emailExpires = Date.now();
  console.log(emailExpires);
  await userService.updateUserById(
    user._id,
    { emailToken: code, emailExpires: emailExpires },
    { new: true, runValidators: true }
  );

  let data = `Please visit the link to confirm email: http://localhost:8000/api/v1/auth/register?userid=${user._id}&verify=${code} Link expires in 2 minutes`;
  await emailService.sendEmail(email, data);
  res.status(httpStatus.CREATED).json({ message: 'Please check your email address for confirmation' });
});

/**
 * Login with email and password
 * @param {string} email
 * @param {string} password
 * @returns {Promise<User>}
 */

const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const user = await authService.loginUser(email, password);
  if (user.verifyEmail == false)
    res.status(httpStatus.BAD_REQUEST).json({ Message: 'Email is not verified or does not exist.' });
  const accessToken = await user.signToken();
  res.status(httpStatus.OK).json({ user, accessToken });
});

const registerStatus = catchAsync(async (req, res) => {
  let { userid, verify } = req.query;
  let user = await userService.getUserById(userid, { emailToken: verify });
  let date = Date.now();
  if (!user) throw new AppError(httpStatus.BAD_REQUEST, 'Token is not defined');
  else {
    if (user.emailToken == null || date - user.emailExpires > 120000) {
      res.status(httpStatus.BAD_REQUEST).json({ Message: 'Token is not defined' });
    } else {
      let userUpdate = await userService.updateUserById(
        userid,
        { verifyEmail: true, emailToken: null, emailExpires: null },
        {
          new: true,
          runValidators: true,
        }
      );
      res.status(httpStatus.OK).json(userUpdate);
    }
  }
});

module.exports = {
  register,
  login,
  registerStatus,
};
