const express = require('express');
const router = express.Router();
const projects = require('../controllers/projects');
const wrapAsync = require('../utils/wrapAsync');
const { isLoggedIn, isAuthor, validateProject } = require('../middleware');
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });

router.route('/')
    .get(wrapAsync(projects.index))
    .post(isLoggedIn, upload.array('image'), validateProject, wrapAsync(projects.createProject))

router.get('/new', isLoggedIn, projects.renderNewForm)

router.route('/:id')
    .get(wrapAsync(projects.showProject))
    .put(isLoggedIn, isAuthor, upload.array('image'), validateProject, wrapAsync(projects.updateProject))
    .delete(isLoggedIn, isAuthor, wrapAsync(projects.deleteProject))

router.get('/:id/edit', isLoggedIn, isAuthor, wrapAsync(projects.renderEditForm))

module.exports = router;