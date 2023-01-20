const schemas = require('../schemas');
const responseComponent = require('./response.component');

module.exports = {
  components: {
    responses: {
      ...responseComponent,
    },
    ...schemas,
  },
};
