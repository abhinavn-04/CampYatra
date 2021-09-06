const Campground = require('./models/campground');
const Review = require('./models/review');
const { campgroundValidationSchema, reviewValidationSchema} = require('./schemas');
const ExpressError = require('./utils/ExpressError');


module.exports.locals = (req, res, next) => {
    res.locals.currentUser = req.session.passport.user;
    console.log(req.session.passport.user);
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
}
module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'You must login first');
        return res.redirect('/login');
    }
    next();
}

module.exports.validateCampground = (req, res, next) => {
    const { error } = campgroundValidationSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(err => err.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}

module.exports.isAuthor=async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to edit this campground');
        return res.redirect(`/campground/${id}`);
    }
    next();
}

module.exports.validateReview = (req, res, next) => {
    const { error } = reviewValidationSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(err => err.message).join(',');
        throw new ExpressError(msg, 400);
    }
    else {
        next();
    }
}

module.exports.isReviewAuthor=async (req, res, next) => {
    const { id,reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if (!review.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to delete this review');
        return res.redirect(`/campground/${id}`);
    }
    next();
}