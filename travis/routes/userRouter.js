const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

const router = express.Router();

router.route('/all').get(userController.getAllUsers);
router.route('/:email').get(userController.getUser);

// Sign up
router.get('/signup', (req, res) => {
  res.render('signup');
});
router.post('/signup', authController.signup);

// After email verification
router.get('/verify-email/:token', authController.verifyEmail);

// Login
router.get('/login', (req, res) => {
  res.render('login');
});
router.post('/login', authController.login);

// Logout
router.get('/logout', authController.logout);

module.exports = router;
