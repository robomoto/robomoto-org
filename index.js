const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate'); //allows for boilerplate layout
const AppError = require('./utils/AppError');


//models
const Project = require('./models/project');
const User = require('./models/user');

//routes files
const projectRoutes = require('./routes/projects');
const degreeRoutes = require('./routes/education');
const authRoutes = require('./routes/auth');

const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');

//db connection
mongoose.connect('mongodb://localhost:27017/roboPortfolio', {
    useNewUrlParser: true, 
    useUnifiedTopology: true, 
    useFindAndModify: false, 
    useCreateIndex: true
})
    .then(() => {
        console.log("Mongo Connection Open");
    })
    .catch( err =>{
        console.log("Mongo Connection Error: " + err);
    })

//app settings
    app.engine('ejs', ejsMate);
    app.set('view engine', 'ejs');
    app.set('views', path.join(__dirname, 'views'));

//============Learning about sessions...should use an environment variable for secret
const sessionOptions = 
{ 
    secret: 'useEnvVariable', 
    resave: false, 
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 24 * 7
    }
}

app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));

//sessions
app.use(session(sessionOptions));
app.use(flash());

//user authentication
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//Middlewares
//flash message middleware 
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

//route prefixes
app.use('/', authRoutes);
app.use('/education', degreeRoutes);
app.use('/projects', projectRoutes);


//Routes
app.get('/', (req, res) => {
    res.render('about');
})

app.all('*', (req, res, next) => {
    next(new AppError('Page Not Found', 404))
})

app.use((err, req, res, next) => {
    const {status = 500} = err;
    if(!err.message) err.message = "Something went wrong.";
    res.status(status).render('error', { err });
})

//server listening
app.listen(3000, () => {
    console.log("App listening on port 3000");
})