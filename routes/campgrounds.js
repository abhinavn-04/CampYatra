const express = require('express');
const router = express.Router();
const wrapAsyncError = require('../utils/wrapAsyncError');
const ExpressError = require('../utils/ExpressError');
const Campground = require('../models/campground');
const { isLoggedIn,isAuthor,validateCampground } = require('../middleware');
const campgrouds = require('../controllers/campgrounds');
const { storage } = require('../cloudinary');
const multer = require('multer');
const upload = multer({ storage });


router.get('/', wrapAsyncError(campgrouds.index))
router.get('/new', isLoggedIn ,campgrouds.newCampgroundForm)
router.get('/:id', wrapAsyncError(campgrouds.showCampground));
router.get('/:id/edit', isLoggedIn, isAuthor, wrapAsyncError(campgrouds.editCampgroundForm));
router.post('/', isLoggedIn, upload.array('image') ,  validateCampground,wrapAsyncError(campgrouds.createCampground))
router.put('/:id',isLoggedIn ,isAuthor, upload.array('image')  ,validateCampground ,wrapAsyncError(campgrouds.updateCampground))
router.delete('/:id', isLoggedIn ,wrapAsyncError(campgrouds.deleteCampground))

module.exports = router;