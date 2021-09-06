const User = require('../models/user');

module.exports.registerUserForm=(req, res) => {
    res.render('users/register');
}

module.exports.register=async (req, res,next) => {
    try {
        const { username, email, password } = req.body;
        const user = new User({ username: username, email: email });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, (err) => {
            if (err) return next(err);
            req.flash('success', 'Successfully Registered!! Welcome to campgrouds');
            res.redirect('/campground');
        })
    } catch (err) {
        req.flash('error', err.message);
        res.redirect('/register');
    }
}

module.exports.loginForm=(req, res) => {
    res.render('users/login');
}

module.exports.login=async (req, res) => {
    req.flash('success', 'Welcome Back!!');
    const redirectUrl = req.session.returnTo || '/campground';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
}

module.exports.logout=(req, res) => {
    req.logout();
    req.flash('success', 'Logged out,Good bye!!');
    res.redirect('/campground');
}