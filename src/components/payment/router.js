/**
 * Payment routes
 */
const express = require('express');
const router = express.Router();
const paymentController = require('./controller');

router.post('/getPaymentFromCoin', paymentController.getPaymentFromCoin);




module.exports = router;