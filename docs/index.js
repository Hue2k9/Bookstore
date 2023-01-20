const servers = require('./servers');
const components = require('./components');
const authModule = require('./modules/auth');

module.exports = {
  openapi: '3.0.3',
  info: {
    title: 'HRM backend API',
    version: '1.0.0',
  },
  ...servers,
  ...components,
  paths: {
    ...authModule,
  },
};
