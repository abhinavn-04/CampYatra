const express = require('express');
const router = express.Router();
const wrapAsyncError = require('../utils/wrapAsyncError');
const ExpressError = require('../utils/ExpressError');
const Campground = require('../models/campground');
const { isLoggedIn,isAuthor,validateCampground,locals } = require('../middleware');
const campgrouds = require('../controllers/campgrounds');
const { storage } = require('../cloudinary');
const multer = require('multer');
const upload = multer({ storage });


router.get('/', locals ,wrapAsyncError(campgrouds.index))
router.get('/new', locals ,isLoggedIn ,campgrouds.newCampgroundForm)
router.get('/:id', locals ,wrapAsyncError(campgrouds.showCampground));
router.get('/:id/edit',locals ,isLoggedIn, isAuthor, wrapAsyncError(campgrouds.editCampgroundForm));
router.post('/',locals ,isLoggedIn, upload.array('image') ,  validateCampground,wrapAsyncError(campgrouds.createCampground))
router.put('/:id', locals ,isLoggedIn ,isAuthor, upload.array('image')  ,validateCampground ,wrapAsyncError(campgrouds.updateCampground))
router.delete('/:id', locals ,isLoggedIn ,wrapAsyncError(campgrouds.deleteCampground))

module.exports = router;