const express = require('express');
const userController = require('../controllers/userController');

const router = express.Router();

// GET 요청이 들어오면 getSignup 함수 실행
router.get('/signup', userController.getSignup);

// POST 요청이 들어오면 signup 함수 실행
router.post('/signup', userController.signup);

module.exports = router;
