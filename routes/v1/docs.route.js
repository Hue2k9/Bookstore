const express = require('express');
const swaggerUI = require('swagger-ui-express');
const docsApi = require('../../docs');

const router = express.Router();

router.use('/', swaggerUI.serve, swaggerUI.setup(docsApi));

module.exports = router;
