if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}
const helmet = require('helmet');
const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const path = require('path');
const mongoose = require('mongoose');
const colors = require('colors');
const Campground = require('./models/campground');
const Review = require('./models/review');
const User = require('./models/user');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const wrapAsyncError = require('./utils/wrapAsyncError');
const ExpressError = require('./utils/ExpressError');
const Joi = require('joi');
const {
    campgroundValidationSchema,
    reviewValidationSchema
} = require('./schemas.js');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const mongoSanitize = require('express-mongo-sanitize');

// importing routes
const campgroundRoutes = require('./routes/campgrounds');
const reviewRoutes = require('./routes/reviews');
const userRoutes = require('./routes/users');


//Connectiong to mongoose
const atlasUrl = process.env.dbURL;
const mongoUrl = 'mongodb://localhost:27017/yelpCamp';
const dbUrl = atlasUrl || mongoUrl;
mongoose.connect(dbUrl, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log("connected to mongo successfully!!".cyan)
    })
    .catch((err) => {
        console.log("Some error!!".red)
        console.log(err);
    });
const secret = process.env.SECRET || 'random-secret';
const store = new MongoStore({
    mongoUrl: mongoUrl,
    secret,
    touchAfter: 24 * 60 * 60
})
store.on('error', function (e) {
    console.log('error with session store!!'.red);
})
const configSession = {
    store,
    name: 'my-session',
    secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        // secure:true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}

const app = express();

app.engine('ejs', ejsMate);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({
    extended: true
}));
app.use(express.static(path.join(__dirname, 'public')))
app.use(methodOverride('_method'));
app.use(helmet())

const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com/",
    "https://api.tiles.mapbox.com/",
    "https://api.mapbox.com/",
    "https://kit.fontawesome.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net/npm/",
];
const styleSrcUrls = [
    "https://cdn.jsdelivr.net/npm/",
    "https://kit-free.fontawesome.com/",
    "https://stackpath.bootstrapcdn.com/",
    "https://api.mapbox.com/",
    "https://api.tiles.mapbox.com/",
    "https://fonts.googleapis.com/",
    "https://use.fontawesome.com/",
];
const connectSrcUrls = [
    "https://api.mapbox.com/",
    "https://a.tiles.mapbox.com/",
    "https://b.tiles.mapbox.com/",
    "https://events.mapbox.com/",
];
const fontSrcUrls = [];
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
                "https://res.cloudinary.com/abhinav-s-cloud/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT! 
                "https://images.unsplash.com/",
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);


app.use(express.static(path.join(__dirname, 'public')));
app.use(session(configSession));
app.use(
    mongoSanitize({
        replaceWith: '_',
    }),
);

app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// const validateCampground = (req, res, next) => {
//     const { error } = campgroundValidationSchema.validate(req.body);
//     if (error) {
//         const msg = error.details.map(err => err.message).join(',');
//         throw new ExpressError(msg, 400);
//     } else {
//         next();
//     }
// }
// const validateReview = (req, res, next) => {
//     const { error } = reviewValidationSchema.validate(req.body);
//     if (error) {
//         const msg = error.details.map(err => err.message).join(',');
//         throw new ExpressError(msg, 400);
//     }
//     else {
//         next();
//     }
// }
// app.use((req, res, next) => {
//     res.locals.currentUser = req.user;
//     res.locals.success = req.flash('success');
//     res.locals.error = req.flash('error');
//     next();
// })

app.get('/', (req, res) => {
    res.locals.currentUser = req.session.passport.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.render('home');
})

// all campgrounds routes below//
app.use('/campground', campgroundRoutes);
// app.get('/campground', wrapAsyncError(async (req, res) => {
//     const campgrounds = await Campground.find({});
//     res.render('campgrounds/index', { campgrounds });
// }))
// app.get('/campground/new', (req, res) => {
//     res.render('campgrounds/new');
// })
// app.get('/campground/:id', wrapAsyncError(async (req, res) => {
//     const campground = await Campground.findById(req.params.id).populate('reviews');
//     res.render('campgrounds/show', { campground });
// }))
// app.get('/campground/:id/edit', wrapAsyncError(async (req, res) => {
//     const campground = await Campground.findById(req.params.id);
//     res.render('campgrounds/edit', { campground });
// }))

// app.post('/campground', validateCampground ,wrapAsyncError(async (req, res) => {
//     // if (!req.body.campground) throw new ExpressError('Invalid Campground Data', 400);
//     const campground = new Campground(req.body.campground);
//     await campground.save();
//     res.redirect(`/campground/${campground._id}`);
// }))

// app.put('/campground/:id', validateCampground ,wrapAsyncError(async (req, res) => {
//     const { id } = req.params;
//     const campground = await Campground.findByIdAndUpdate(id, req.body.campground);
//     res.redirect(`/campground/${campground._id}`);
// }))

// app.delete('/campground/:id', wrapAsyncError(async (req, res) => {
//     const campground = await Campground.findByIdAndDelete(req.params.id);
//     res.redirect('/campground');
// }))
// campgrounds routes ends //


// all review routes below //
app.use('/campground/:id/reviews', reviewRoutes);
// app.post('/campground/:id/reviews', validateReview ,wrapAsyncError(async (req, res) => {
//     const { id } = req.params;
//     const campground = await Campground.findById(id);
//     // console.log(req.body);
//     const review = new Review(req.body.review);
//     // console.log(review);
//     campground.reviews.push(review);
//     await review.save();
//     await campground.save();

//     res.redirect(`/campground/${campground._id}`);
// }))

// app.delete('/campground/:id/reviews/:reviewId', wrapAsyncError(async (req, res) => {
//     const { id, reviewId } = req.params;
//     await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
//     await Review.findByIdAndDelete(reviewId);
//     res.redirect(`/campground/${id}`);

// }))
// reviews routes ends //

app.use('/', userRoutes);

app.get('*', (req, res, next) => {
    next(new ExpressError('Page not found!!', 404));
})

app.use((err, req, res, next) => {
    const {
        statusCode = 500
    } = err;
    if (!err.message) err.message = 'Something went wrong';
    res.status(statusCode).render('error', {
        err
    });
})

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`listening to port ${port} for yelpcamp`.cyan);
})