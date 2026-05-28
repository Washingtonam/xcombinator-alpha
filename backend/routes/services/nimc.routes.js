const express = require('express');
const router = express.Router();
const nimcController = require('../controllers/services/nimc.controller');

router.post('/process', nimcController.processNIMC);

module.exports = router;