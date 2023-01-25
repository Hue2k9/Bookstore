const express = require('express');
const authController = require('../../controllers/auth.controller');
const { passportFacebook } = require('../../middlewares/passport');
const passport = require('passport');
const router = express.Router();

router.post('/register', authController.register).get('/register', authController.registerStatus);
router.post('/login', authController.login);
router.post('/facebook', passport.authenticate('facebook-token', { session: false }), authController.authFacebook);
router.post('/google', passport.authenticate('google-plus-token', { session: false }), authController.authGoogle);

module.exports = router;
