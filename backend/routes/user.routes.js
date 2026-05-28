const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/auth.controller');
const { protect } = require('../middleware/authMiddleware');
const { getProfile } = require('../controllers/user.controller');

// Add these missing routes
router.post('/register', register);
router.post('/login', login);
router.get('/profile', protect, getProfile);

module.exports = router;