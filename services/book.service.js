const httpStatus = require('http-status');
const { Book } = require('../models');
const AppError = require('../utils/AppError');
const AdvancedQuery = require('../utils/advancedQuery');
const { query } = require('express');

/**
 * @param {Object} book
 * @returns {Promise<Book>}
 */
const createBook = async (book) => {
  const newBook = await Book.findOne({ slug: book.slug });
  if (newBook) throw new AppError('Book is already!');
  return Book.create(book);
};

/**
 * get books
 * @param {Object} book
 * @param {Object} query
 * @returns {Promise<Book>}
 */
const getBooks = async (book, query) => {
  const features = new AdvancedQuery(Book.find(query).populate('cateGory', 'categoryName'), book).filter().sort().paginate();
  return await features.query;
};

/**
 * Get book by slug
 * @param {String} slug
 * @returns {Promise<Book>}
 */
const getBookBySlug = async (slug) => {
  return Book.findOne({ slug: slug });
};

/**
 * Get book by id
 * @param {ObjectId} id
 * @returns {Promise<Book>}
 */
const getBookById = async (id) => {
  return Book.findById(id);
};

/**
 * Update book by slug
 * @param {ObjectId} slug
 * @param {String} fieldsUpdate
 * @returns {Promise<Book>}
 */
const updateBookBySlug = async (slug, fieldsUpdate) => {
  const book = await Book.findOneAndUpdate({ slug: slug }, fieldsUpdate, {
    new: true,
    runValidators: true,
  });
  if (!book) throw new AppError(httpStatus.NOT_FOUND, 'Slug is not exist!');
  return book;
};

/**
 * Delete book by slug
 * @param {ObjectId} bookId
 * @returns {Promise<Book>}
 */
const deleteBookBySlug = async (slug) => {
  const book = await getBookBySlug(slug);
  if (!book) throw new AppError(httpStatus.NOT_FOUND, 'Book is not exist!');
  await book.remove();
  return book;
};

module.exports = {
  createBook,
  getBooks,
  getBookBySlug,
  getBookById,
  updateBookBySlug,
  deleteBookBySlug,
};
