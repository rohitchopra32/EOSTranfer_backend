/**
 * User routes
 */
const express = require('express');
const router = express.Router();
const userController = require('./controller');

router.post('/nameAlreadyExist', userController.nameAlreadyExist);
router.get('/getPayAmount', userController.getPayAmount);
router.post('/currencyAmount', userController.currencyAmount);
router.post('/createAccount', userController.createAccount);
router.post('/signWithMetaMask', userController.signWithMetaMask);




module.exports = router;