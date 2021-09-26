const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
    cloud_name: process.env.cloudinaryName,
    api_key: process.env.cloudinaryAPIKey,
    api_secret: process.env.cloudinaryAPISecret
});
const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'YelpCamp',
        allowedFormats: ['jpeg', 'png', 'jpg']
    }
});
module.exports = {
    cloudinary,storage
}