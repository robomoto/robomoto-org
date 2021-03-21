const express = require('express');
const router = express.Router();
const User = require('../models/user');
const users = require('../controllers/users');
const wrapAsync = require('../utils/wrapAsync');
const passport = require('passport');

// router.route('/register')
//     .get(users.renderRegistrationForm)
//     .post(wrapAsync(users.registerUser))

router.route('/login')
    .get(users.renderLoginForm)
    .post(passport.authenticate('local', {failureFlash: true, failureRedirect: '/login'}), wrapAsync(users.loginUser))

router.get('/logout', users.logoutUser)

module.exports = router;