const httpStatus = require('http-status');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');
const { categoryService } = require('../services');

const addCategory = catchAsync(async (req, res) => {
  const cateGory = await categoryService.addCategory(req.body);
  res.status(httpStatus.CREATED).json(cateGory);
});

module.exports = {
  addCategory,
};
