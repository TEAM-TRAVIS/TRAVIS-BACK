// localhost:3000/img
const express = require('express');
const multer = require('multer'); //이미지 request 처리
const imgController = require('../controllers/imgController');

const router = express.Router();

// multer 설정
const memStorage = multer.memoryStorage(); // 메모리 storage 선택
const uploadToMem = multer({ storage: memStorage }); //메모리에 image 임시 저장

// 프로필 이미지 저장
//localhost:3000/img/save
router.get('/save', (req, res) => {
  res.render('save');
});
// POST 요청이 들어왔을 때, multer 미들웨어를 먼저 실행 -> request의 file 필드를 읽어서 서버 메모리에 임시 저장 -> imgController.save를 호출
router.post('/save', uploadToMem.single('file'), imgController.saveImage);

// 프로필 이미지 조회
//localhost:3000/img/get
router.get('/get', (req, res) => {
  res.render('get');
});
router.post('/get', imgController.getImage);

module.exports = router;
