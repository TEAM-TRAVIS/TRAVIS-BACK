const express = require('express');
const passport = require('passport');
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
router.post(
  '/login',
  passport.authenticate('local', {
    successRedirect: '/main',
    failureRedirect: 'user/login',
  }),
);

// Logout
router.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      console.error('Error logging out:', err);
      return res.status(500).send('Error logging out');
    }
    res.render('login');
  });
  res.redirect('/');
});

module.exports = router;
