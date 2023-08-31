const express = require('express');
const imgController = require('../controllers/imgController');

const router = express.Router();

// 프로필 이미지 저장
//localhost:3000/img/save
router.get('/save', (req, res) => {
  res.render('save');
});
router.post('/save', imgController.saveImage);

// 프로필 이미지 조회
//localhost:3000/img/get
router.get('/get', (req, res) => {
  res.render('get');
});
router.post('/get', imgController.getImage);

module.exports = router;
