const express = require('express');
const userController = require('../../controllers/user.controller');
// const { protect, restrictTo } = require('./../../middlewares/auth');
const { protect, restrictTo } = require('../../middlewares/auth');
const router = express.Router();

router.use(protect);
// router.use(restrictTo('admin'));

router.route('/').post(userController.createUser).get(userController.getUsers);

router.route('/:userId').get(userController.getUser).put(userController.updateUser).delete(userController.deleteUser);

module.exports = router;
