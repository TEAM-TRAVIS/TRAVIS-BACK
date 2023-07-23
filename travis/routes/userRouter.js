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
router.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user) => {
    if (!user) {
      return res.status(401).render('login', { message: 'Login failed' });
    }
    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      return res.redirect('/main');
    });
  })(req, res, next); // 함수 내부에서 req, res, next 사용하기 위해 필요
});

// Logout
router.get('/logout', userController.logout);

module.exports = router;
