
const Project = require('./models/project');
const { projectSchema, degreeSchema } = require('./utils/joiSchemas');
const AppError = require('./utils/AppError');

module.exports.isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;
        req.flash('error', 'You must be signed in.');
        return res.redirect('/login');
    }
    next();
}

module.exports.isAuthor = async(req, res, next) => {
    const { id } = req.params;
    const project = await Project.findById(id);
    if(!project.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that.');
        return res.redirect(`/projects/${id}`);
    } 
    next();
}

//validate project
module.exports.validateProject = (req, res, next) => { 
    const { error } = projectSchema.validate(req.body);
    if(error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new AppError(msg, 400);
    } else {
        next()
    }
}

//validate degree
const validateDegree = (req, res, next) => {    
    const { error } = degreeSchema.validate(req.body);
    if(error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new AppError(msg, 400);
    } else {
        next()
    }
}