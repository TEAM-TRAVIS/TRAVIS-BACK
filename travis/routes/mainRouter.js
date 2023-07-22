const express = require('express');
const mainController = require('../controllers/mainController');

const router = express.Router();

router.get('/', (req, res) => {
  res.render('main'); // main.ejs 파일을 렌더링
});

module.exports = router;
