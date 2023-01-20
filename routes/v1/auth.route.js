const express = require('express');
const authController = require('../../controllers/auth.controller');

const router = express.Router();

router.post('/register', authController.register).get('/register', authController.registerStatus);
router.post('/login', authController.login);

module.exports = router;
