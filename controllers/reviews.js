const Review = require('../models/review');
const Campground = require('../models/campground');

module.exports.createReview = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    const review = new Review(req.body.review);
    campground.reviews.push(review);
    review.author = req.user._id;
    await review.save();
    await campground.save();
    req.flash('success', 'Succesfully added a new review!!');
    res.redirect(`/campground/${campground._id}`);
}
module.exports.deleteReview=async (req, res) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Succesfully deleted a review!!');
    res.redirect(`/campground/${id}`);

}
