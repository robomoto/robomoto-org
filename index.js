if(process.env.NODE_ENV !== "production") {
    require('dotenv').config()
}

const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate'); //allows for boilerplate layout
const AppError = require('./utils/AppError');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/roboPortfolio';

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
const MongoStore = require('connect-mongo')(session); 

//db connection
mongoose.connect(dbUrl, { 
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

const store = new MongoStore({
    url: dbUrl,
    secret: process.env.SESSION_SECRET,
    touchAfter: 24 * 3600
});

store.on("error", function(e){
    console.log("Store Session Error", e);
});

const sessionOptions = 
{ 
    store,
    name: 'robo_session',
    secret: process.env.SESSION_SECRET, 
    resave: false, 
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        // secure: true, 
        expires: Date.now() + 1000 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 24 * 7
    }
}

app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));
app.use(mongoSanitize({
    replaceWith: '_'
}));
app.use(helmet());

const scriptSrcUrls = [
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net",
];
const styleSrcUrls = [
    "https://fonts.googleapis.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net",
];
const connectSrcUrls = [];
const fontSrcUrls = [
    "https://cdnjs.cloudflare.com/",
    "https://fonts.gstatic.com/",
];
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/dvrwgpplb/", 
                // "https://images.unsplash.com/",
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);

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

const port = process.env.PORT || 3000;

//server listening
app.listen(port, () => {
    console.log(`App listening on port ${PORT}`);
})