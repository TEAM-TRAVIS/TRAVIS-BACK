const express = require('express');
const userController = require('../controllers/userController');

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

// Google Login

module.exports = router;
