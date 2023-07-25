const express = require('express');
const GPSController = require('../controllers/GPSController');

const router = express.Router();

// POST 요청이 들어오면 signup 함수 실행
router.post('/saveGPS', GPSController.saveGPS);

// GET 요청이 들어오면 getSignup 함수 실행
router.get('/readGPS', GPSController.readGPS);

module.exports = router;
