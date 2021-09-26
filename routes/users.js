const express = require('express');
const router = express.Router();
const User = require('../models/user');
const wrapAsyncError = require('../utils/wrapAsyncError');
const passport = require('passport');
const users = require('../controllers/users');

router.get('/register', users.registerUserForm);
router.post('/register', wrapAsyncError(users.register))
router.get('/login', users.loginForm)
router.post('/login', passport.authenticate('local',{failureFlash:true,failureRedirect:'/login'}) , users.login)
router.get('/logout', users.logout)

module.exports = router;