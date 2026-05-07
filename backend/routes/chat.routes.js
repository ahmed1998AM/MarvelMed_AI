const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chat.controller');
const { protect } = require('../middleware/auth.middleware');

// @route   POST /api/chat/session
// @desc    Create new chat session
// @access  Private
router.post('/session', protect, chatController.createChatSession);

// @route   GET /api/chat
// @desc    Get all chat sessions for user
// @access  Private
router.get('/', protect, chatController.getUserChats);

// @route   GET /api/chat/:id
// @desc    Get single chat session
// @access  Private
router.get('/:id', protect, chatController.getChat);

// @route   POST /api/chat/:id/message
// @desc    Send message in chat
// @access  Private
router.post('/:id/message', protect, chatController.sendMessage);

// @route   DELETE /api/chat/:id
// @desc    Delete chat session
// @access  Private
router.delete('/:id', protect, chatController.deleteChat);

// @route   POST /api/chat/:id/clear
// @desc    Clear chat messages
// @access  Private
router.post('/:id/clear', protect, chatController.clearChat);

module.exports = router;
