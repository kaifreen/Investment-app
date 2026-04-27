const express = require('express');
const router = express.Router();
const { generateChatResponse } = require('../controllers/chatController');
const authMiddleware = require('../middleware/authMiddleware');

// POST /api/chat - Generate chat response
// Body: { message, riskLevel?, investmentGoal?, portfolio? }
router.post('/', authMiddleware, generateChatResponse);

module.exports = router;
