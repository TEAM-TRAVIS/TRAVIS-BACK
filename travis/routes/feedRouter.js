// localhost:3000/feed
const express = require('express');
const publicSummaryController = require('../controllers/publicSummaryController');

const router = express.Router();

router.get('/', publicSummaryController.getAllPublicSummary);

module.exports = router;
