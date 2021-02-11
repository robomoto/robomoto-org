let express = require('express');
let router = express.Router();
let Project = require('../models/project');
let wrapAsync = require('../utils/wrapAsync');


//index route
router.get('/', wrapAsync(async (req, res) => {
    const projects = await Project.find({});
    console.log(projects);
    res.render("projects/index", {projects});
}))

//new route
router.get('/new', (req, res) => {
    res.render('projects/new');
})

//post route
router.post('/', wrapAsync(async (req, res) => {
    req.body.project.tags = req.body.project.tags.replace(/\s/g, '').split(",");
    const newProject = new Project(req.body.project);  //not sanitizing or error checking
    await newProject.save();
    res.redirect(`/projects/${newProject._id}`);
}))

//show route
router.get('/:id', wrapAsync(async (req, res) => {
    const { id } = req.params;
    const project = await Project.findById(id);    
    res.render('projects/show', { project });
}))

//edit route
router.get('/:id/edit', wrapAsync(async (req, res) => {
    const { id } = req.params;
    const project = await Project.findById(id);
    console.log(project);
    res.render('projects/edit', {project});
}))

//update route
router.put('/:id', wrapAsync(async (req, res) => {
    const { id } = req.params;
    req.body.project.tags = req.body.project.tags.replace(/\s/g, '').split(",");
    console.log(req.body.project);
    const project = await Project.findByIdAndUpdate(id, req.body.project, {runValidators: true, new: true});
    res.redirect(`/projects/${project._id}`);
}))

//delete route
router.delete('/:id', wrapAsync(async (req, res) => {
    const { id } = req.params;
    const deletedProject = await Project.findByIdAndDelete(id);
    res.redirect('/projects');
}))

module.exports = router;