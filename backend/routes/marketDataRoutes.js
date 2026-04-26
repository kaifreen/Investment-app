const express = require('express');
const router = express.Router();
const { getStockPrices } = require('../controllers/marketDataController');
const { protect } = require('../middleware/authMiddleware');

router.get('/stocks', protect, getStockPrices);

module.exports = router;
