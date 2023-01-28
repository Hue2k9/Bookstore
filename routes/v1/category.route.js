const express = require('express');
const categoryController = require('../../controllers/category.controller');
const { protect, restricTo } = require('../../middlewares/auth');
const router = express.Router();

router.route('/').post(categoryController.addCategory);

module.exports = router;
