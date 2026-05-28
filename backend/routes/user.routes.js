const express = require('express');
const router = express.Router();
const { getProfile } = require('../controllers/user.controller');
const { protect } = require('../middleware/authMiddleware');

// Now, only authenticated users can access this route
router.get('/profile', protect, getProfile);

module.exports = router;