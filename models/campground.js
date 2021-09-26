const { string } = require('joi');
const mongoose = require('mongoose');
const Review = require('./review');
const Schema = mongoose.Schema;
const opts = { toJSON: { virtuals: true } };

const imageSchema = new Schema({
    url: String,
    filename: String
})
imageSchema.virtual('imgThumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_200');
});

const campgroundSchema = new Schema({
    title: String,
    price: Number,
    description: String,
    location:String,
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    images: [imageSchema],
    author:{
            type: Schema.Types.ObjectId,
            ref:'User'
        },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref:'Review'
        }
    ]
},opts);
campgroundSchema.virtual('properties.popUp').get(function () {
    return `<strong><a href="/campground/${this._id}">${this.title}</a></strong>`;
})

//Middleware to delete all reviews after if user delete campground
campgroundSchema.post('findOneAndDelete', async (camp) => {
    if (camp) {
        await Review.deleteMany({ _id: { $in: camp.reviews } });
    }
})

const Campground = mongoose.model('Campground', campgroundSchema);
module.exports = Campground;