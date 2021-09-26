const express = require('express');
const router = express.Router({mergeParams:true});

const wrapAsyncError = require('../utils/wrapAsyncError');
const ExpressError = require('../utils/ExpressError');

const reviews = require('../controllers/reviews');

// const { reviewValidationSchema } = require('../schemas.js');
const { isLoggedIn,validateReview ,isReviewAuthor} = require('../middleware');


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

router.post('/', isLoggedIn, validateReview, wrapAsyncError(reviews.createReview));
router.delete('/:reviewId', isLoggedIn, isReviewAuthor, wrapAsyncError(reviews.deleteReview));
module.exports = router;