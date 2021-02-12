let express = require('express');
let router = express.Router();
let Project = require('../models/project');
let wrapAsync = require('../utils/wrapAsync');

//index route
router.get('/', wrapAsync(async (req, res) => {
    const projects = await Project.find({});
    res.render("projects/index", {projects});
}))

//show route
router.get('/:id', wrapAsync(async (req, res) => {
    const { id } = req.params;
    const project = await Project.findById(id);    
    res.render('projects/show', { project });
}))

module.exports = router;