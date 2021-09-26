const path = require('path');
const mongoose = require('mongoose');
const colors = require('colors');
const Campground = require('../models/campground');
const {
    places,
    descriptors
} = require('./seedHelpers');
const cities = require('./cities');

//Connectiong to mongoose
mongoose.connect('mongodb://localhost:27017/yelpCamp', {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => {
        console.log("connected to mongo successfully!!".cyan)
    })
    .catch((err) => {
        console.log("Some error!!".red)
        console.log(err);
    });

const pickRandom = array => array[Math.floor(Math.random() * array.length)];
const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 250; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const randomLocation = `${cities[random1000].city} , ${cities[random1000].state}`
        // console.log(randomLocation)
        const camp = new Campground({
            author: '613081bf4c60bd9ec12f5b05',
            location: randomLocation,
            title: `${pickRandom(descriptors)} ${pickRandom(places)}`,
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Iure laudantium quis ipsa illo, fuga odio voluptates ipsam, incidunt soluta nihil omnis consequuntur quisquam similique deserunt doloribus labore nam, accusamus aspernatur!',
            price: price,
            geometry: {
                type: "Point",
                coordinates: [
                    cities[random1000].longitude,
                    cities[random1000].latitude
                ]
            },
            images: [
                {
                    url: 'https://res.cloudinary.com/abhinav-s-cloud/image/upload/v1630735161/YelpCamp/ewsntpmly6wgkr0kbioa.jpg',
                    filename: 'YelpCamp/ewsntpmly6wgkr0kbioa',
                },
                {
                    url: 'https://res.cloudinary.com/abhinav-s-cloud/image/upload/v1630735162/YelpCamp/evcbdcb5jkyvau1inix3.jpg',
                    filename: 'YelpCamp/evcbdcb5jkyvau1inix3',
                },
                {
                    url: 'https://res.cloudinary.com/abhinav-s-cloud/image/upload/v1630735162/YelpCamp/pihvmjhxu8g4keojpi1z.jpg',
                    filename: 'YelpCamp/pihvmjhxu8g4keojpi1z',
                }
            ]
        })
        await camp.save()
    }

}
seedDB().then(() => {
    console.log('Disconnected to mongo succesfully!!'.grey)
    mongoose.connection.close();
})