const express = require('express');
const getSummaryController = require('../controllers/getSummaryController');
const getGPSController = require('../controllers/getGPSController');
const saveGPSController = require('../controllers/saveGPSController');

const router = express.Router();

router.get('/read/:name', getSummaryController.getUserSummary); //마이페이지
router.get('/read/:name/:date', getGPSController.getUserGpS); //상세페이지
router.post('/save', saveGPSController.saveGPS); //[save] 눌렀을 때

module.exports = router;
