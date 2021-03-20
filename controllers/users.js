const User = require('../models/user');

module.exports.renderRegistrationForm = (req, res) => {
    res.render('auth/register');
}

module.exports.registerUser = async (req, res, next) => {
    try {
        const { username, nickname, email, password } = req.body;
        const newUser = new User({ email, nickname, username });
        console.log(newUser);
        const registeredUser = await User.register(newUser, password);
        req.login(registeredUser, err => {
            if (err) return next(err);
        req.flash('success', 'Welcome to Robomoto Portfolio');
        res.redirect('/projects')
        })
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('/register');
    }
}

module.exports.renderLoginForm = (req, res) => {
    res.render('auth/login');
}

module.exports.loginUser = async (req, res) => {
    req.flash('success', 'Welcome back!');
    console.log(req.session.redirectUrl);
    const redirectUrl = req.session.redirectUrl || '/projects';
    delete req.session.redirectUrl;
    res.redirect(redirectUrl);
}

module.exports.logoutUser = (req, res) => {
    req.logout();
    req.flash('success', 'You are logged out.')
    res.redirect('/');
}