const express = require('express');
const passport = require('passport');
const userController = require('../controllers/userController');

const router = express.Router();

router.get('/signup', (req, res) => {
  res.render('signup');
});
router.post('/signup', userController.signup);

router.get('/login', (req, res) => {
  res.render('login');
});

router.post(
  '/login',
  passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: 'user/login',
  }),
);

module.exports = router;
