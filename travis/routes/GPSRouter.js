// localhost:3000/gps
const express = require('express');
const getSummaryController = require('../controllers/getSummaryController');
const getGPSController = require('../controllers/getGPSController');
const saveGPSController = require('../controllers/saveGPSController');
const accumulatedGPSController = require('../controllers/accumulatedGPSController');
const multer = require('multer'); //이미지 request 처리

const router = express.Router();

// multer 설정
const memStorage = multer.memoryStorage(); // 메모리 storage 선택
const uploadToMem = multer({ storage: memStorage }); //메모리에 image 임시 저장

// POST 요청이 들어왔을 때, multer 미들웨어를 먼저 실행 -> request의 SS 필드를 읽어서 서버 메모리에 임시 저장 -> saveGPSController.saveGPS를 호출
router.post('/save', uploadToMem.single('file'), saveGPSController.saveGPS);

// 마이페이지
// router.get('/summary', (req, res) => {
//   res.render('summary');
// });
// router.post('/summary/:email', getSummaryController.updateSummary);

router.route('/summary/all').post(getSummaryController.getUserSummary);

router
  .route('/summary')
  .post(getSummaryController.getOneSummary)
  .delete(getSummaryController.deleteOneSummary);

router.route('/summary/update').post(getSummaryController.updateSummary);

// 상세페이지
router.post('/daily/:year/:month/:day', getSummaryController.getDailySummary);
router.post('/weekly/:year/:week', getSummaryController.getWeeklySummary);
router.post('/monthly/:year/:month', getSummaryController.getMonthlySummary);
router.post('/yearly/:year', getSummaryController.getYearlySummary);

router.get('/detail', (req, res) => {
  res.render('detail');
});
router.route('/detail').post(getGPSController.getUserGPS).delete(getGPSController.deleteUserGPS);



// x일 동안의 GPS 데이터 합침
router.post('/accumulated', accumulatedGPSController.sendUserGpsSummary);

module.exports = router;
