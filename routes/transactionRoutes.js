const express = require('express');
const router = express.Router();

const { recordTransactionIn, recordTransactionOut } = require('../controllers/transactionController');

router.post('/in', recordTransactionIn);
router.post('/out', recordTransactionOut);

module.exports = router;
