// localhost:3000/main
const express = require('express');
const passport = require('passport');
const mainController = require('../controllers/mainController');

const router = express.Router();

console.log('이자식');
// router.get('/', mainController.getMainPage);
router.get('/main', passport.authenticate('jwt', { session: false }), mainController.getMainPage);

module.exports = router;
