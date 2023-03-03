const httpStatus = require('http-status');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');
const { bookService, transactionService } = require('../services');
const { assign } = require('nodemailer/lib/shared');
const { NOT_FOUND, OK } = require('http-status');
const fs = require('fs');
const moment = require('moment-timezone');

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

const addVNPayTransaction = catchAsync(async (req, res) => {
  let ipAddr =
    req.headers['x-forwarded-for'] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress;

  let config = require('config');

  let tmnCode = config.get('vnp_TmnCode');
  let secretKey = config.get('vnp_HashSecret');
  let vnpUrl = config.get('vnp_Url');
  let returnUrl = config.get('vnp_ReturnUrl');

  let dateFormat = require('dateformat');
  let date = await new Date();
  let createDate = moment.tz(date, 'UTC').tz('Asia/Ho_Chi_Minh').format('YYYYMMDDHHmmss');
  let orderId = dateFormat(date, 'yyyymmddHHmmss');
  let amount = req.body.amount;
  let bankCode = req.body.bankCode;

  let orderInfo = `OrderId: ${req.params.id} Description: ${req.body.orderDescription} 
                   ${moment.tz(date, 'UTC').tz('Asia/Ho_Chi_Minh').format('YYYYMMDDHHmmss')}`;
  let orderType = req.body.orderType;
  let locale = req.body.language;
  if (locale === null || locale === '') {
    locale = 'vn';
  }
  let currCode = 'VND';
  let vnp_Params = {};
  vnp_Params['vnp_Version'] = '2.1.0';
  vnp_Params['vnp_Command'] = 'pay';
  vnp_Params['vnp_TmnCode'] = tmnCode;
  // vnp_Params['vnp_Merchant'] = ''
  vnp_Params['vnp_Locale'] = locale;
  vnp_Params['vnp_CurrCode'] = currCode;
  vnp_Params['vnp_TxnRef'] = orderId;
  vnp_Params['vnp_OrderInfo'] = orderInfo;
  vnp_Params['vnp_OrderType'] = orderType;
  vnp_Params['vnp_Amount'] = amount * 100;
  vnp_Params['vnp_ReturnUrl'] = returnUrl;
  vnp_Params['vnp_IpAddr'] = ipAddr;
  vnp_Params['vnp_CreateDate'] = createDate;
  if (bankCode !== null && bankCode !== '') {
    vnp_Params['vnp_BankCode'] = bankCode;
  }

  vnp_Params = sortObject(vnp_Params);

  let querystring = require('qs');
  let signData = querystring.stringify(vnp_Params, { encode: false });
  let crypto = require('crypto');
  let hmac = crypto.createHmac('sha512', secretKey);
  let signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

  vnp_Params['vnp_SecureHash'] = signed;
  vnpUrl += '?' + querystring.stringify(vnp_Params, { encode: false });

  res.send(vnpUrl);
});

const getVNPayTransaction = catchAsync(async (req, res) => {
  let vnp_Params = req.query;

  let secureHash = vnp_Params['vnp_SecureHash'];

  delete vnp_Params['vnp_SecureHash'];
  delete vnp_Params['vnp_SecureHashType'];

  vnp_Params = sortObject(vnp_Params);

  let config = require('config');
  let tmnCode = config.get('vnp_TmnCode');
  let secretKey = config.get('vnp_HashSecret');

  let querystring = require('qs');
  let signData = querystring.stringify(vnp_Params, { encode: false });
  let crypto = require('crypto');
  let hmac = crypto.createHmac('sha512', secretKey);
  let signed = hmac.update(new Buffer(signData, 'utf-8')).digest('hex');

  if (secureHash === signed) {
    //Kiem tra xem du lieu trong db co hop le hay khong va thong bao ket qua
    let data = await fs.readFileSync('D:/NodeJS/hrm-api/common/transactionStatus.json');
    let status = JSON.parse(data);
    let error = Object.keys(status);
    let code = '';

    for (let key of error) {
      if (vnp_Params['vnp_ResponseCode'] == key) {
        code = status[key];
        break;
      }
    }
    res.status(httpStatus.OK).json({ code: code });
  } else {
    res.status(httpStatus.OK).json({ code: '97' });
  }
});

function sortObject(obj) {
  let sorted = {};
  let str = [];
  let key;
  for (key in obj) {
    if (obj.hasOwnProperty(key)) {
      str.push(encodeURIComponent(key));
    }
  }
  str.sort();
  for (key = 0; key < str.length; key++) {
    sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, '+');
  }
  return sorted;
}

module.exports = {
  addTransaction,
  getTransactions,
  getTransactionById,
  updateTransaction,
  deleteTransaction,
  addVNPayTransaction,
  getVNPayTransaction,
};
