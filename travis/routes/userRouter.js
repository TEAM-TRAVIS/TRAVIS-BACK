const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const userController = require('../controllers/userController');
const UserModel = require('../models/userModel');

const router = express.Router();

// Sign up
router.get('/signup', (req, res) => {
  res.render('signup');
});
router.post('/signup', userController.signup);

// Login
router.get('/login', (req, res) => {
  res.render('login');
});
router.post('/login', userController.login);

// Logout
router.get('/logout', userController.logout);

module.exports = router;
