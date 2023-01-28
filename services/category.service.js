const httpStatus = require('http-status');
const { Category } = require('../models');
const AppError = require('../utils/AppError');
const AdvancedQuery = require('../utils/advancedQuery');

/**
 * add category
 * @param {Object} categoryName
 * @returns {Promise<Category>}
 */
const addCategory = async (categoryName) => {
  const category = await Category.findOne({ categoryName: categoryName.slug });
  if (category) throw new AppError('Category is already!');
  return Category.create(categoryName);
};

module.exports = {
  addCategory,
};
