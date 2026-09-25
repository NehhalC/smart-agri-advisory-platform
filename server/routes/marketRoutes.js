const express = require('express');
const router = express.Router();
const marketController = require('../controllers/marketController');

router.get('/prices', marketController.getMarketPrices);
router.post('/calculate-profit', marketController.calculateProfit);

module.exports = router;
