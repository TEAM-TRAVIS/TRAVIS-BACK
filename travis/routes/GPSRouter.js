const express = require('express');
const GPSController = require('../controllers/GPSController');

const router = express.Router();

// gps/save URL 처리
router.get('/read/:email', GPSController.getUserGPS);
router.post('/save', GPSController.saveGPS);

module.exports = router;
