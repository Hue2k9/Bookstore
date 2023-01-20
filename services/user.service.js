const httpStatus = require('http-status');

const { User } = require('../models');
const AppError = require('../utils/AppError');

/**
 * Create a user
 * @param {Object} createUserDto
 * @returns {Promise<User>}
 */
const createUser = async (createUserDto) => {
  if (await User.isEmailTaken(createUserDto.email)) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  return User.create(createUserDto);
};

/**
 * Query for users
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryUsers = async (filter, options) => {
  const users = await User.paginate(filter, options);
  return users;
};

/**
 * Get user by id
 * @param {ObjectId} id
 * @returns {Promise<User>}
 */
const getUserById = async (id) => {
  return User.findById(id);
};

/**
 * Get user by email
 * @param {string} email
 * @returns {Promise<User>}
 */
const getUserByEmail = async (email) => {
  return User.findOne({ email });
};

/**
 * Update user by id
 * @param {ObjectId} userId
 * @param {Object} updateUserDto
 * @returns {Promise<User>}
 */
const updateUserById = async (userId, updateUserDto) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  if (updateUserDto.email && (await User.isEmailTaken(updateUserDto.email, userId))) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Email already taken');
  }

  Object.assign(user, updateUserDto);
  await user.save();
  return user;
};

/**
 * Delete user by id
 * @param {ObjectId} userId
 * @returns {Promise<User>}
 */
const deleteUserById = async (userId) => {
  const user = await getUserById(userId);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  await user.remove();
  return user;
};

module.exports = {
  createUser,
  queryUsers,
  getUserById,
  getUserByEmail,
  updateUserById,
  deleteUserById,
};
