const express = require('express');
const router = express.Router();
const degrees = require('../controllers/degrees')
const wrapAsync = require('../utils/wrapAsync');
const AppError = require('../utils/AppError');
const { isLoggedIn, isAuthor, validateDegree } = require('../middleware')



//index route
router.get('/', wrapAsync(degrees.index))

module.exports = router;