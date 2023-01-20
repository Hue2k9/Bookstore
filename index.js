const { port, env } = require('./config/vars');
const logger = require('./config/logger');
const app = require('./app');
const mongoose = require('./config/mongoose');

// open mongoose connection
mongoose.connect();

// listen to requests
const server = app.listen(port, () => logger.info(`server started on port ${port} (${env})`));

const exitHandler = () => {
  if (server) {
    server.close(() => {
      logger.info('Server closed');
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

const unexpectedErrorHandler = (error) => {
  logger.error(error);
  exitHandler();
};

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);

process.on('SIGTERM', () => {
  logger.info('SIGTERM received');
  if (server) {
    server.close();
  }
});

module.exports = server;
