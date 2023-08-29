// localhost:3000
const express = require('express');
const passport = require('passport');

const router = express.Router();

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index', { title: 'Express' });
});

// Passport 설정
// express 내에서 passport를 require 했고 세션 인증 미들웨어와 함께 초기화
router.use(passport.initialize());
router.use(passport.session());

module.exports = router;
