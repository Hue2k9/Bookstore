const httpStatus = require('http-status');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');
const { bookService, fileService } = require('../services');
const fs = require('fs');
const doc = require('file-convert');
const PDFDocument = require('pdf-lib').PDFDocument;
const slugify = require('slugify');
const { OK } = require('http-status');
const officegen = require('officegen');

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
  let { title } = req.body;
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

const addPreview = catchAsync(async (req, res) => {
  let file = req.file;
  const options = {
    libreofficeBin: process.env.LIBREO_OFFICE_BIN,
    sourceFile: file.path,
    outputDir: process.env.Book_Storage,
    img: false,
    imgExt: 'jpg',
    reSize: 800,
    density: 120,
    disableExtensionCheck: true,
  };

  // Convert document to pdf and/or image
  await doc
    .convert(options)
    .then((res) => {
      console.log('Convert pdf successfully!\n', res);
    })
    .catch((e) => {
      console.log('e', e);
    });

  //Read file
  let name = file.originalname;
  let newName = name.split('.');
  const docmentAsBytes = await fs.promises.readFile(`${process.env.Book_Storage}/${newName[0]}.pdf`);

  // Read your PDFDocument
  const pdfDoc = await PDFDocument.load(docmentAsBytes);
  const numberOfPages = pdfDoc.getPages().length;
  let numberReview = req.body.numberPagesDisplay;
  await fileService.createPreview(req.params.id, { totalPages: numberOfPages, numberPagesDisplay: numberReview });

  // Create a new "sub" document
  const subDocument = await PDFDocument.create();
  for (let i = 0; i < numberReview; i++) {
    // copy the page at current index
    const [copiedPage] = await subDocument.copyPages(pdfDoc, [i]);
    // add page
    subDocument.addPage(copiedPage);
  }
  const pdfBytes = await subDocument.save();
  await writePdfBytesToFile(`${process.env.Book_Storage}/review-${name}.pdf`, pdfBytes);

  fs.unlinkSync(`${process.env.Book_Storage}/${newName[0]}.pdf`);

  let newFilePath = `${process.env.Book_Storage}/review-${name}.pdf`;
  const newFile = { book: req.params.id, filePath: newFilePath, fileType: 'document' };
  await fileService.createFile(newFile);
  return res.status(httpStatus.OK).json(newFile);
});

function writePdfBytesToFile(fileName, pdfBytes) {
  return fs.promises.writeFile(fileName, pdfBytes);
}

const readOffice = catchAsync(async (req, res) => {
  console.log('hello world');
  // Read the .docx file
  let docx = officegen('docx');
  let file = req.file.originalname;
  console.log(file);
  let stream = fs.createReadStream(file);
  docx.on('error', function (err) {
    console.log(err);
  });
  // Parse the .docx file
  let totalPages = 0;
  let totalParagraphs = 0;
  docx.on('pageCount', function (count) {
    totalPages = count;
  });
  docx.on('readable', function () {
    let paragraph;
    while ((paragraph = docx.read())) {
      if (paragraph.type === 'Text') {
        totalParagraphs++;
      }
    }
  });
  // Read the stream
  stream.pipe(docx);

  // Log the results
  stream.on('end', function () {
    console.log('Total Pages:', totalPages);
    console.log('Total Paragraphs:', totalParagraphs);
  });
  // Read the stream
  stream.pipe(docx);
});

module.exports = {
  createBook,
  getBooks,
  getBookById,
  getBookBySlug,
  updateBookBySlug,
  deleteBookBySlug,
  addPreview,
  readOffice,
};
