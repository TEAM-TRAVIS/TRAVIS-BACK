const express = require('express');
const GPSController = require('../controllers/GPSController');

const router = express.Router();

// gps/save URL 처리
router.get('/save', (req, res) => {
  res.render('gps');
});
router.post('/save', GPSController.saveGPS);

module.exports = router;
