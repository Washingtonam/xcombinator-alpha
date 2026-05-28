const express = require('express');
const router = express.Router();
const walletController = require('../controllers/wallet.controller');

router.get('/balance', walletController.getBalance);

module.exports = router;