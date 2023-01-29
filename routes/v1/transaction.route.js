const express = require('express');
const transactionController = require('../../controllers/transaction.controller');
const { protect, restrictTo } = require('../../middlewares/auth');
const router = express.Router();

router.route('/').post(protect, transactionController.addTransaction).get(protect, transactionController.getTransactions);

router
  .route('/:id')
  .get(protect, restrictTo('admin'), transactionController.getTransactionById)
  .put(protect, restrictTo('admin'), transactionController.updateTransaction)
  .delete(protect, restrictTo('admin'), transactionController.deleteTransaction);

module.exports = router;
