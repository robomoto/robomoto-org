const express = require('express');
const router = express.Router();
const degrees = require('../controllers/degrees');
const wrapAsync = require('../utils/wrapAsync');
const { isLoggedIn, isDegreeAuthor, validateDegree } = require('../middleware');
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });

router.route('/')
    .get(wrapAsync(degrees.index))
    .post(isLoggedIn, validateDegree, wrapAsync(degrees.createDegree))

router.get('/new', isLoggedIn, degrees.renderNewForm)

router.route('/:id')
    .get(wrapAsync(degrees.showDegree))
    .put(isLoggedIn, isDegreeAuthor, upload.array('image'), validateDegree, wrapAsync(degrees.updateDegree))
    .delete(isLoggedIn, isDegreeAuthor, wrapAsync(degrees.deleteDegree))

router.get('/:id/edit', isLoggedIn, isDegreeAuthor, wrapAsync(degrees.renderEditForm))

module.exports = router;