const authSchema = require('./auth.schema');
const commonSchema = require('./common.schema');
const userSchema = require('./user.schema');
const errorSchema = require('./error.schema');

module.exports = {
  schemas: {
    ...commonSchema,
    ...authSchema,
    ...userSchema,
    ...errorSchema,
  },
};
