const Project = require('../models/project');
const { cloudinary } = require('../cloudinary');

module.exports.index = async (req, res) => {
    const projects = await Project.find({});
    res.render("projects/index", {projects});
}

module.exports.renderNewForm = (req, res) => {
    res.render('projects/new');
}

module.exports.createProject = async (req, res) => {
    console.log(req.body);
    req.body.project.tags = req.body.project.tags.split(",").map(function(item){ 
        return item.trim()
    });
    req.body.project.author = res.locals.currentUser;
    const newProject = new Project(req.body.project);  //not sanitizing or error checking
    newProject.imgs = req.files.map(f => ({url: f.path, filename: f.filename}));
    await newProject.save();
    console.log('newProject:');
    console.log(newProject);
    req.flash('success', 'Successfully added a new project');
    res.redirect(`/projects/${newProject._id}`);
}

module.exports.showProject = async (req, res) => {
    const project = await Project.findById(req.params.id);
    if(!project){
        req.flash('error', 'Could not find project');
        res.redirect('/projects');
    }  
    res.render('projects/show', { project });
}

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const project = await Project.findById(id);
    if(!project){
        req.flash('error', 'Could not find project');
        res.redirect('/projects');
    }  
    res.render('projects/edit', {project});
}

module.exports.updateProject = async (req, res) => {
    const { id } = req.params;
    console.log(req.body)
    const project = await Project.findById(id);
    req.body.project.tags = req.body.project.tags.split(",").map(function(item){ return item.trim()});
    req.body.project.author = res.locals.currentUser;
    console.log(req.body.project);
    const p = await Project.findByIdAndUpdate(id, req.body.project, {runValidators: true, new: true});
    const images = req.files.map(f => ({url: f.path, filename: f.filename}));
    p.imgs.push(...images);
    await p.save();
    if(req.body.deleteImages){
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await p.updateOne({$pull: {imgs: {filename: {$in: req.body.deleteImages}}}})
    }
    req.flash('success', `Successfully updated ${req.body.project.name}`);
    res.redirect(`/projects/${p._id}`);
}

module.exports.deleteProject = async (req, res) => {
    const { id } = req.params;
    const deletedProject = await Project.findByIdAndDelete(id);
    if(!deletedProject){
        req.flash('error', 'Could not find project');
        res.redirect('/projects');
    }  
    req.flash('success', `Successfully deleted project`)
    res.redirect('/projects');
}