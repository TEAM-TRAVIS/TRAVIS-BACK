const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
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
router.post('/login', (req, res, next) => {
  passport.authenticate('local', { session: false }, (err, user) => {
    if (err || !user) {
      return res.status(401).json({ error: 'Login failed' });
    }
    console.log('성공쓰: userRouter.js');
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    return res.json({ user: user, token });
  })(req, res, next);
});

// Logout
router.get('/logout', userController.logout);

module.exports = router;
