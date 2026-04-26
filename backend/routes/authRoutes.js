const express = require('express');
const { register, login, getProfile, updateProfile } = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Public Routes
router.post('/register', register);
router.post('/login', login);

// Protected Routes
router.get('/profile', authMiddleware, getProfile);
router.put('/profile', authMiddleware, updateProfile);

module.exports = router;
