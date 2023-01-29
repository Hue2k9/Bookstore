const httpStatus = require('http-status');
const { File, Book } = require('../models');
const AppError = require('../utils/AppError');

/**
 * @param {Object} book
 * @param {String} filePath
 * @returns {Promise<File>}
 */
const createFile = async (file) => {
  return File.create(file);
};

/**
 * Update book review
 * @param {ObjectId} id
 * @param {Object} fieldsUpdate
 * @returns
 */
const createPreview = async (id, fieldsUpdate) => {
  let book = await Book.findById(id);
  if (!book) throw new AppError('Book Id not found');
  return await Book.findByIdAndUpdate(id, fieldsUpdate);
};

module.exports = {
  createFile,
  createPreview,
};
