const multer = require('multer');
const multerStores = multer.memoryStorage();
const util = require('util');

//Storage images
const storageImages = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, process.env.Images_Storage);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = file.originalname;
    cb(null, uniqueSuffix);
    return uniqueSuffix;
  },
});

//Storage files
const storageFiles = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, process.env.Book_Storage);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = file.originalname;
    cb(null, uniqueSuffix);
    return uniqueSuffix;
  },
});

//Filter images
const imageFilter = (req, file, cb) => {
  if (file.mimetype == 'image/png' || file.mimetype == 'image/jpg' || file.mimetype == 'image/jpeg') {
    cb(null, true);
  } else {
    cb(null, false);
    return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
  }
};

const uploadImages = multer({
  storage: storageImages,
  fileFilter: imageFilter,
});

const uploadFiles = multer({ storage: storageFiles });

//Save multiple images
const uploadImagesMiddleware = util.promisify(uploadImages.array('images', 10));

//Save a book
const uploadFileMiddleware = util.promisify(uploadFiles.single('file'));

module.exports = {
  uploadImagesMiddleware,
  uploadFileMiddleware,
};
