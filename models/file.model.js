const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const fileSchema = new Schema(
  {
    book: {
      type: Schema.Types.ObjectId,
      ref: 'book',
      require: true,
    },
    filePath: {
      type: String,
      require: true,
    },
    fileType: {
      type: String,
      enum: ['image', 'document', 'video'],
      default: 'image',
    },
  },
  {
    timestamp: true,
  }
);

/**
 * @typedef File
 */
const File = mongoose.model('File', fileSchema);
module.exports = File;
