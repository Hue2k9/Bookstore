const express = require('express');
const categoryController = require('../../controllers/category.controller');
const { protect, restrictTo } = require('../../middlewares/auth');
const router = express.Router();

router.use(protect);
router.use(restrictTo('admin'));

router.route('/').post(categoryController.addCategory);

module.exports = router;
