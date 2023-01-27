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

//Save multiple images
const uploadImagesMiddleware = util.promisify(uploadImages.array('images', 10));

module.exports = {
  uploadImagesMiddleware,
};
