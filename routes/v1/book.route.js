const express = require('express');
var multer = require('multer');
const bookController = require('../../controllers/book.controller');
const { protect, restricTo } = require('../../middlewares/auth');
const { uploadImagesMiddleware } = require('../../middlewares/upload');
const router = express.Router();

router
  .route('/')
  .post(uploadImagesMiddleware, bookController.createBook)
  .get(bookController.getBooks)
  .get(bookController.getBookBySlug);

router
  .route('/:slug')
  .get(bookController.getBookBySlug)
  .put(bookController.updateBookBySlug)
  .delete(bookController.deleteBookBySlug);

module.exports = router;
