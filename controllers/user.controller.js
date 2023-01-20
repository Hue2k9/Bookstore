const httpStatus = require('http-status');

const pick = require('../utils/pick');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');
const { userService } = require('../services');

const createUser = catchAsync(async (req, res) => {
  const user = await userService.createUser(req.body);

  res.status(httpStatus.CREATED).json(user);
});

const getUsers = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'role']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);

  const result = await userService.queryUsers(filter, options);

  res.status(httpStatus.OK).json(result);
});

const getUser = catchAsync(async (req, res) => {
  const { userId } = req.params;

  const user = await userService.getUserById(userId);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  res.status(httpStatus.OK).json(user);
});

const updateUser = catchAsync(async (req, res) => {
  const { userId } = req.params;
  const user = await userService.updateUserById(userId, req.body);

  res.status(httpStatus.OK).json(user);
});

const deleteUser = catchAsync(async (req, res) => {
  const { userId } = req.params;
  await userService.updateUserById(userId, { active: false });

  res.status(httpStatus.NO_CONTENT).json();
});

module.exports = {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
};
