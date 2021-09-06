const Campground = require('../models/campground');
const { cloudinary } = require('../cloudinary');

const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const geocoder = mbxGeocoding({ accessToken: process.env.mapboxToken });

module.exports.index = async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });
}
module.exports.newCampgroundForm=(req, res) => {
    res.render('campgrounds/new');
}
module.exports.createCampground = async (req, res) => {
    const geoData = await geocoder.forwardGeocode({
        query: req.body.campground.location,
        limit: 1
    }).send();
    const campground = new Campground(req.body.campground);
    campground.geometry = geoData.body.features[0].geometry;
    campground.images = req.files.map(f => ({ url: f.path, filename: f.filename }))
    campground.author = req.user._id;
    await campground.save();
    console.log(campground);
    req.flash('success', 'Succesfully created a new campground!!');
    res.redirect(`/campground/${campground._id}`);
}
module.exports.showCampground=async (req, res) => {
    const campground = await Campground.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path:'author'
        }
    }).populate('author');
    if (!campground) {
        req.flash('error', 'No campground found');
        return res.redirect('/campground');
    }
    res.render('campgrounds/show', { campground });
}
module.exports.editCampgroundForm=async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(req.params.id);
    if (!campground) {
        req.flash('error', 'No campground found');
        return res.redirect('/campground');
    }
    res.render('campgrounds/edit', { campground });
}
module.exports.updateCampground = async (req, res) => {
    const { id } = req.params;
    const updatedCamp = await Campground.findByIdAndUpdate(id, req.body.campground);
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    // console.log(imgs)
    updatedCamp.images.push(...imgs);
    await updatedCamp.save();
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await updatedCamp.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } });
        // console.log(req.body.deleteImages);
    }
    req.flash('success', 'Succesfully updated a campground!!');
    res.redirect(`/campground/${updatedCamp._id}`);
}
module.exports.deleteCampground=async (req, res) => {
    const { id } = req.params;
    const deletedCampground = await Campground.findByIdAndDelete(req.params.id);
    req.flash('success', 'Succesfully deleted a campground!!');
    res.redirect('/campground');
}
