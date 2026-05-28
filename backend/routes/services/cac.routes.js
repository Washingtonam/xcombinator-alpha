const express = require('express');
const router = express.Router();
// Change this line:
const cacController = require('../../controllers/services/cac.controller');

router.post('/process', cacController.processCAC);

module.exports = router;