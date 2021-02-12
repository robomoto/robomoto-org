const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const Project = require('./models/project');
const ejsMate = require('ejs-mate');
const projectRoutes = require('./routes/projects');
const degreeRoutes = require('./routes/education');
const AppError = require('./AppError');

mongoose.connect('mongodb://localhost:27017/roboPortfolio', {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => {
        console.log("Mongo Connection Open");
    })
    .catch( err =>{
        console.log("Mongo Connection Error: " + err);
    })
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));
app.use('/education', degreeRoutes);
app.use('/projects', projectRoutes);

app.get('/', (req, res) => {
    res.render('about');
})

app.use((err, req, res, next) => {
    console.log(err.name);
    if (err.name === 'ValidationError') err = handleValidationErr(err) //example of handling a specific type of Mongoose error
    next(err);
})

app.use((err, req, res, next) => {
    const {status = 500, message = 'Something went wrong'} = err;
    res.status(status).send(message);
})


app.listen(3000, () => {
    console.log("App listening on port 3000");
})