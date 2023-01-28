const httpStatus = require('http-status');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');
const { bookService, fileService } = require('../services');
const slugify = require('slugify');

const createBook = catchAsync(async (req, res) => {
  let files = await req.files;
  const newBook = await bookService.createBook(req.body);
  for (let i = 0; i < files.length; i++) {
    const filePath = process.env.Images_Storage + '/' + files[i].originalname;
    const bookImage = { book: newBook.id, filePath: filePath };
    fileService.createFile(bookImage);
  }
  res.status(httpStatus.CREATED).json({ Book: { newBook } });
});

const getBooks = catchAsync(async (req, res) => {
  let book = req.query;
  let { price } = req.query;
  let query = {};
  //Get books by price from min to max
  if (price) {
    let [min, max] = price.split('-');
    book.price = {};
    query.price = { $gte: min, $lte: max };
  }
  const result = await bookService.getBooks(book, query);
  res.status(httpStatus.OK).json(result);
});

const getBookById = catchAsync(async (req, res) => {
  let { id } = req.params;
  const book = await bookService.getBookById(id);
  if (!book) throw new AppError(httpStatus.NOT_FOUND, 'Book is not found');
  res.status(httpStatus.OK).json(book);
});

const getBookBySlug = catchAsync(async (req, res) => {
  let { slug } = req.params;
  const book = await bookService.getBookBySlug(slug);
  if (!book) throw new AppError(httpStatus.NOT_FOUND, 'Book is not found');
  res.status(httpStatus.OK).json(book);
});

const updateBookBySlug = catchAsync(async (req, res) => {
  let { slug } = req.params;
  let title = req.body;
  let newslug;
  if (title) {
    newslug = slugify(title, {
      replacement: '-',
      lower: true,
    });
  }
  let fieldsUpdate = {
    title: req.body.title,
    descreption: req.body.descreption,
    price: req.body.price,
    quantity: req.body.quantity,
    file: req.body.file,
    slug: newslug,
  };
  const book = await bookService.updateBookBySlug(slug, fieldsUpdate);
  res.status(httpStatus.OK).json(book);
});

const deleteBookBySlug = catchAsync(async (req, res) => {
  const { slug } = req.params;
  await bookService.deleteBookBySlug(slug);
  res.status(httpStatus.OK).json('Message: Deleted!');
});

module.exports = {
  createBook,
  getBooks,
  getBookById,
  getBookBySlug,
  updateBookBySlug,
  deleteBookBySlug,
};
