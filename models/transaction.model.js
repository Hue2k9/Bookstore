const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const transactionSchema = mongoose.Schema(
  {
    quantity: {
      type: Number,
      required: [true, 'Quantity is required'],
    },
    status: {
      type: String,
      enum: ['wait for confirmation', 'confirmed', 'delivering', 'delivered'],
      default: 'wait for confirmation',
    },
    payStatus: {
      type: String,
      enum: ['unpaid', 'paid'],
      default: ['unpaid'],
    },
    book: {
      type: Schema.Types.ObjectId,
      ref: 'Book',
      require: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      require: true,
    },
    transactionType: {
      type: String,
      enum: ['direct', 'online'],
      default: 'direct',
    },
  },
  {
    timestamps: true,
  }
);

/**
 * @typedef Transaction
 */
const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;
