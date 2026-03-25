const express = require('express');
const router = express.Router();

const {
  getSummary,
  getLowStockItems,
  getValuation,
} = require('../controllers/reportingController');

router.get('/summary', getSummary);
router.get('/low-stock', getLowStockItems);
router.get('/valuation', getValuation);

module.exports = router;
