const express = require('express');
const router = express.Router();
const User = require('../models/user');
const wrapAsyncError = require('../utils/wrapAsyncError');
const passport = require('passport');
const users = require('../controllers/users');
const { locals } = require('../middleware');

router.get('/register',locals ,users.registerUserForm);
router.post('/register', locals ,wrapAsyncError(users.register))
router.get('/login',locals ,users.loginForm)
router.post('/login',locals ,passport.authenticate('local',{failureFlash:true,failureRedirect:'/login'}) , users.login)
router.get('/logout', locals ,users.logout)

module.exports = router;