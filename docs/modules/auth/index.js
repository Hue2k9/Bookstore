const register = require('./register');
const login = require('./login');

module.exports = {
  '/api/v1/auth/register': {
    ...register,
  },
  '/api/v1/auth/login': {
    ...login,
  },
};
