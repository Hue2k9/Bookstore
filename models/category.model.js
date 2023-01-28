const mongoose = require('mongoose');
const slugify = require('slugify');
const Schema = mongoose.Schema;

const categorySchema = mongoose.Schema(
  {
    categoryName: {
      type: String,
      required: [true, 'Category is required'],
    },
    slug: { type: String, unique: true },
  },
  {
    timestamps: true,
  }
);

categorySchema.pre('save', function (next) {
  this.slug = slugify(this.categoryName, {
    replacement: '-',
    lower: true,
  });
  next();
});

/**
 * @typedef Category
 */
const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
