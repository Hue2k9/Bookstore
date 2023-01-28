const express = require('express');
const bookController = require('../../controllers/book.controller');
const { protect, restrictTo } = require('../../middlewares/auth');
const { uploadImagesMiddleware } = require('../../middlewares/upload');
const router = express.Router();

router
  .route('/')
  .post(protect, restrictTo('admin'), uploadImagesMiddleware, bookController.createBook)
  .get(bookController.getBooks)
  .get(bookController.getBookBySlug);

router
  .route('/:slug')
  .get(bookController.getBookBySlug)
  .put(protect, restrictTo('admin'), bookController.updateBookBySlug)
  .delete(protect, restrictTo('admin'), bookController.deleteBookBySlug);

module.exports = router;
