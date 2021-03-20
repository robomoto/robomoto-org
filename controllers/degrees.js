const Degree = require('../models/degree');

module.exports.index = async (req, res) => {
    const sort = {gradYear: -1};
    const degrees = await Degree.find({}).sort(sort);
    res.render("education/index", {degrees});
}

module.exports.renderNewForm = (req, res) => {
    res.render('education/new');
}

module.exports.createDegree = async (req, res) => {
    console.log(req.body);
    req.body.degree.classes = req.body.degree.classes.split(",").map(function(item){ return item.trim()});
    req.body.degree.author = res.locals.currentUser;
    const newDegree = new Degree(req.body.degree);  //not sanitizing or error checking
     await newDegree.save();
    console.log('newDegree:');
    console.log(newDegree);
    req.flash('success', 'Successfully added a new degree');
    res.redirect(`/education/${newDegree._id}`);
}

module.exports.showDegree = async (req, res) => {
    const degree = await Degree.findById(req.params.id);
    if(!degree){
        req.flash('error', 'Could not find degree');
        res.redirect('/education');
    }  
    res.render('education/show', { degree });
}

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const degree = await Degree.findById(id);
    if(!degree){
        req.flash('error', 'Could not find degree');
        res.redirect('/education');
    }  
    console.log(degree);
    res.render('education/edit', { degree });
}

module.exports.updateDegree = async (req, res) => {
    const { id } = req.params;
    console.log(req.body)
    const degree = await Degree.findById(id);
    req.body.degree.classes = req.body.degree.classes.split(",").map(function(item){ return item.trim()});
    req.body.degree.author = res.locals.currentUser;
    console.log(req.body.degree);
    const d = await Degree.findByIdAndUpdate(id, req.body.degree, {runValidators: true, new: true});
    await d.save();
    req.flash('success', `Successfully updated ${req.body.degree.name}`);
    res.redirect(`/education/${d._id}`);
}

module.exports.deleteDegree = async (req, res) => {
    const { id } = req.params;
    const deletedDegree = await Degree.findByIdAndDelete(id);
    if(!deletedDegree){
        req.flash('error', 'Could not find Degree');
        res.redirect('/education');
    }  
    req.flash('success', `Successfully deleted degree`)
    res.redirect('/education');
}