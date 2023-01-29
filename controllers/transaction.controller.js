const httpStatus = require('http-status');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');
const { bookService, transactionService } = require('../services');
const { assign } = require('nodemailer/lib/shared');
const { NOT_FOUND, OK } = require('http-status');

const addTransaction = catchAsync(async (req, res) => {
  const { name, address, phone } = req.user;
  const { book, quantity } = req.body;
  if (!name || !phone || !address || !book || !quantity)
    return res
      .status(httpStatus.BAD_REQUEST)
      .json({ Message: 'You need to update your personal information to make a purchase' });
  const transaction = {
    user: req.user.id,
    book: req.body.book,
    quantity: req.body.quantity,
  };
  const newTransaction = await transactionService.addTransaction(transaction, book, quantity);
  res.status(httpStatus.CREATED).json(newTransaction);
});

const getTransactions = catchAsync(async (req, res) => {
  let query = {};
  let user = req.user;
  if (user.role == 'user') {
    query.user = {};
    query.user._id = user.id;
  }
  let transactions = await transactionService.getTransactions(req.query, query);
  let array = [];
  transactions.forEach((element, i) => {
    let obj = {};
    obj.id = element.id;
    obj.quantity = element.quantity;
    obj.book = {};
    obj.book.price = element.book.price;
    obj.book.name = element.book.title;
    obj.user = {};
    obj.user.name = element.user.name;
    obj.user.address = element.user.address;
    obj.user.phone = element.user.phone;
    obj.totalPrice = element.quantity * element.book.price;
    obj.date = element.updatedAt;
    array.push(obj);
  });
  res.status(httpStatus.OK).json({ array });
});

const getTransactionById = catchAsync(async (req, res) => {
  const { id } = req.params;
  let transaction = await transactionService.getTransactionById(id);
  let array = [];
  let obj = {};
  obj.id = transaction.id;
  obj.quantity = transaction.quantity;
  obj.book = {};
  obj.book.price = transaction.book.price;
  obj.book.name = transaction.book.title;
  obj.user = {};
  obj.user.id = transaction.user.id;
  obj.user.name = transaction.user.name;
  obj.user.address = transaction.user.address;
  obj.user.phone = transaction.user.phone;
  obj.totalPrice = transaction.quantity * transaction.book.price;
  obj.date = transaction.updatedAt;
  array.push(obj);
  return res.status(httpStatus.OK).json(obj);
});

const updateTransaction = catchAsync(async (req, res) => {
  let { id } = req.params;
  let filedsUpdate = req.body;
  let transaction = await transactionService.updateTransaction(id, filedsUpdate);
  res.status(httpStatus.OK).json(transaction);
});

const deleteTransaction = catchAsync(async (req, res) => {
  let { id } = req.params;
  let transaction = await transactionService.deleteTransaction(id);
  return res.status(httpStatus.OK).json(transaction);
});
module.exports = {
  addTransaction,
  getTransactions,
  getTransactionById,
  updateTransaction,
  deleteTransaction,
};
