const httpStatus = require('http-status');
const AppError = require('../utils/AppError');
const AdvancedQuery = require('../utils/advancedQuery');
const { Transaction, Book } = require('../models');
const { query } = require('express');

/**
 * add transaction
 * @param {Object} information
 * @param {ObjectId} bookId
 * @param {Number} quantity
 * @returns {Promise<Transaction>}
 */
const addTransaction = async (information, bookId, quantity) => {
  let transaction = await Transaction.create(information);
  if (transaction) {
    let book = await Book.findById(bookId);
    if (quantity <= book.quantity) {
      let newQuantity = book.quantity - quantity;
      await Book.findByIdAndUpdate(bookId, { quantity: newQuantity });
    } else throw new AppError('Quantity exceeded limit');
  }

  return Transaction.create(information);
};

/**
 * get transactions
 * @param {Object} transaction
 * @param {Object} query
 * @returns {Promise<Transaction>}
 */
const getTransactions = async (transaction, query) => {
  const features = new AdvancedQuery(Transaction.find(query).populate('book').populate('user'), transaction)
    .filter()
    .sort()
    .paginate();

  return await features.query;
};

/**
 * get a transaction
 * @param {ObjectId} id
 * @returns {Promise<Transaction>}
 */
const getTransactionById = async (id) => {
  let transaction = Transaction.findById(id).populate('book').populate('user');
  if (!transaction) throw new AppError('Transaction is not found');
  return Transaction.findById(id).populate('book').populate('user');
};

/**
 * update transactionn
 * @param {ObjectId} id
 * @param {Object} information
 * @returns {Promise<Transaction>}
 */
const updateTransaction = async (id, information) => {
  const transaction = await Transaction.findByIdAndUpdate(id, information, {
    new: true,
    runValidators: true,
  });
  if (!transaction) throw new AppError(httpStatus.NOT_FOUND, 'Transaction ID is not exist!');
  return transaction;
};

/**
 * delete transaction
 * @param {*} id
 * @returns {Promise<Transaction>}
 */
const deleteTransaction = async (id) => {
  const transaction = await getTransactionById(id);
  if (!transaction) throw new AppError(httpStatus.NOT_FOUND, 'Transaction ID is not exist!');
  return transaction;
};

module.exports = {
  addTransaction,
  getTransactionById,
  getTransactions,
  updateTransaction,
  deleteTransaction,
};
