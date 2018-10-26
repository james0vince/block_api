const express = require('express');
const checkAuth = require('../middleware/check-auth');
const checkKyc = require('../middleware/check-kyc');

const router = express.Router();
const transactionsController = require('../controllers/transactions');

router.get('/', checkAuth, checkKyc, transactionsController.transactions_get_all);
router.get('/:id', checkAuth, checkKyc, transactionsController.transactions_get_one);
router.post('/', checkAuth, checkKyc, transactionsController.transactions_create_transaction);

module.exports = router;
