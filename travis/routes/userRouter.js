const express = require('express');
const userController = require('../controllers/userController');

const router = express.Router();

router.route('/').get(userController.getAllUsers);

// Sign up
router.get('/signup', (req, res) => {
  res.render('signup');
});
router.post('/signup', userController.signup);

// After email verification
router.get('/verify-email/:token', userController.verifyEmail);

// Login
router.get('/login', (req, res) => {
  res.render('login');
});
router.post('/login', userController.login);

// Logout
router.get('/logout', userController.logout);

module.exports = router;
