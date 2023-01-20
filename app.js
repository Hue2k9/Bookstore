const cors = require('cors');
const hpp = require('hpp');
const xss = require('xss-clean');
const morgan = require('morgan');
const helmet = require('helmet');
const express = require('express');
const httpStatus = require('http-status');
const compression = require('compression');
const mongoSanitize = require('express-mongo-sanitize');

const routes = require('./routes/v1');
const AppError = require('./utils/AppError');
const { logs, env } = require('./config/vars');
const { authLimiter } = require('./middlewares/rate-limiter');
const { errorConverter, globalErrorHandler } = require('./middlewares/error');

const app = express();

app.use(morgan(logs));

app.use(hpp());

// set security HTTP headers
app.use(helmet());

// parse json request body
app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// sanitize request data
app.use(xss());
app.use(mongoSanitize());

// gzip compression
app.use(compression());

// enable cors
app.use(cors());
app.options('*', cors());

// limit repeated failed requests to auth endpoints
if (env === 'production') {
  app.use('/api/v1/auth', authLimiter);
}

// v1 api routes
app.use('/api/v1', routes);

// send back a 404 error for any unknown api request
app.all('*', (req, res, next) => {
  next(new AppError(httpStatus.NOT_FOUND, 'Not found'));
});

// convert error to AppError, if needed
app.use(errorConverter);

// handle error
app.use(globalErrorHandler);

module.exports = app;
