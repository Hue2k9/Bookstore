const httpStatus = require('http-status');
const AppError = require('../utils/AppError');
const nodeMailer = require('nodemailer');
const { User } = require('../models');

const sendEmail = async (email, data) => {
  const user = await User.find({ email });
  let text = 'test';
  if (!user) throw new AppError(httpStatus.BAD_REQUEST, 'Email does not exist');
  else {
    var transporter = nodeMailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL_FROM,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    var mainOptions = {
      from: 'Sun Store',
      to: email,
      subject: 'Verify Sun Store account registation',
      text: data,
    };

    transporter.sendMail(mainOptions, function (err, info) {
      if (err) {
        console.log(err);
      } else {
        console.log('Message sent: ' + info.response);
      }
    });
  }
};

module.exports = { sendEmail };
