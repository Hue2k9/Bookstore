const httpStatus = require('http-status');
const { File } = require('../models');
const AppError = require('../utils/AppError');

/**
 * @param {Object} book
 * @param {String} filePath
 * @returns {Promise<File>}
 */
const createFile = async (file) => {
  return File.create(file);
};

module.exports = {
  createFile,
};
