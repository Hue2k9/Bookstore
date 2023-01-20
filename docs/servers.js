const { port } = require('./../config/vars');

module.exports = {
  servers: [
    {
      url: `http://localhost:${port}`,
      description: 'Development server',
    },
  ],
};
