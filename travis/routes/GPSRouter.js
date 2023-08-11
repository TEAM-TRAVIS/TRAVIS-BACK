const express = require('express');
const getSummaryController = require('../controllers/getSummaryController');
const getGPSController = require('../controllers/getGPSController');
const saveGPSController = require('../controllers/saveGPSController');
const accumulatedGPSController = require('../controllers/accumulatedGPSController');

const router = express.Router();

// 마이페이지
// router.get('/summary', (req, res) => {
//   res.render('summary');
// });
router
  .route('/summary')
  .post(getSummaryController.getUserSummary)
  .get(getSummaryController.getOneSummary)
  .delete(getSummaryController.deleteOneSummary);

// 상세페이지
router.post('/daily/:year/:month/:day', getSummaryController.getDailySummary);
router.post('/weekly/:year/:week', getSummaryController.getWeeklySummary);
router.post('/monthly/:year/:month', getSummaryController.getMonthlySummary);
router.post('/yearly/:year', getSummaryController.getYearlySummary);

router.get('/detail', (req, res) => {
  res.render('detail');
});
router.route('/detail').post(getGPSController.getUserGPS).delete(getGPSController.deleteUserGPS);

// [save] 눌렀을 때
router.post('/save', saveGPSController.saveGPS);

// x일 동안의 GPS 데이터 합침
router.get('/accumulated/:email', accumulatedGPSController.sendUserGpsSummary);

module.exports = router;
