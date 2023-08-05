const express = require('express');
const getSummaryController = require('../controllers/getSummaryController');
const getGPSController = require('../controllers/getGPSController');
const saveGPSController = require('../controllers/saveGPSController');

const router = express.Router();

//마이페이지
router.get('/summary', (req, res) => {
  res.render('summary');
});
router.post('/summary', getSummaryController.getUserSummary);

router.post('/daily/:year/:month/:day', getSummaryController.getDailySummary);
router.post('/weekly/:year/:week', getSummaryController.getWeeklySummary);
router.post('/monthly/:year/:month', getSummaryController.getMonthlySummary);
router.post('/yearly/:year', getSummaryController.getYearlySummary);

//상세페이지
router.get('/detail', (req, res) => {
  res.render('detail');
});
router.post('/detail', getGPSController.getUserGPS);

//[save] 눌렀을 때
router.post('/save', saveGPSController.saveGPS);

module.exports = router;
