const express = require('express');
const router = express.Router();
const { createOrder, captureOrder } = require('../controllers/paymentController');
const { initiateJazzCashPayment } = require('../controllers/jazzcashController');
const { initiateEasyPaisaPayment } = require('../controllers/easypaisaController');

router.post('/create-order', createOrder);
router.post('/capture-order', captureOrder);
router.post('/jazzcash', initiateJazzCashPayment);
router.post('/easypaisa', initiateEasyPaisaPayment);

module.exports = router;
