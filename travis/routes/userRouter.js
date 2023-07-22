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
    successRedirect: '/main', // 로그인 성공 시 메인 페이지로
    failureRedirect: '/user/login', // 로그인 실패 시 로그인 페이지로
  }),
);

// Logout
router.get('/logout', userController.logout);

module.exports = router;
