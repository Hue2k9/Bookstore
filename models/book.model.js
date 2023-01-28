const mongoose = require('mongoose');
const { CategoryEnum } = require('../common/globalEnums');
const slugify = require('slugify');
const Schema = mongoose.Schema;
const bookSchema = mongoose.Schema(
  {
    author: String,
    title: {
      type: String,
      required: [true, 'Title is required'],
    },
    price: Number,
    oldPrice: {
      type: Number,
      default: null,
    },
    cateGory: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
    },
    illustration: {
      type: String,
      required: [true, 'illustration is required'],
    },
    previewFile: String,
    quantity: {
      type: Number,
      required: [true, 'Quantity is required'],
    },
    slug: { type: String, unique: true },
    tag: String,
    totalPages: Number,
    numberPagesDisplay: {
      type: Number,
      default: 0,
    },
    poster: { type: Schema.Types.ObjectId, ref: 'user' },
    descreption: String,
  },
  {
    timestamps: true,
  }
);

bookSchema.pre('save', function (next) {
  this.slug = slugify(this.title, {
    replacement: '-',
    lower: true,
  });
  next();
});

/**
 * @typedef Book
 */
const Book = mongoose.model('Book', bookSchema);
module.exports = Book;
