const express = require('express');
const router = express.Router();
const Chat = require('../models/Chat');
const AIAgent = require('../models/AIAgent');
const { protect } = require('../middleware/auth.middleware');

// @route   GET /api/chat/sessions
// @desc    Get all chat sessions for user
// @access  Private
router.get('/sessions', protect, async (req, res) => {
  try {
    const chats = await Chat.find({ userId: req.user.id })
      .sort({ updatedAt: -1 })
      .limit(50);

    res.json({
      success: true,
      count: chats.length,
      data: { chats }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'حدث خطأ',
      error: error.message
    });
  }
});

// @route   POST /api/chat/sessions
// @desc    Create new chat session
// @access  Private
router.post('/sessions', protect, async (req, res) => {
  try {
    const { agentId, agentName, agentType } = req.body;

    const agent = await AIAgent.findOne({ _id: agentId });
    
    const chat = await Chat.create({
      userId: req.user.id,
      agentId: agentId || 'default',
      agentName: agentName || 'طبيب عام',
      agentType: agentType || 'general'
    });

    res.status(201).json({
      success: true,
      data: { chat }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'حدث خطأ',
      error: error.message
    });
  }
});

// @route   GET /api/chat/sessions/:id
// @desc    Get single chat session
// @access  Private
router.get('/sessions/:id', protect, async (req, res) => {
  try {
    const chat = await Chat.findOne({ 
      _id: req.params.id, 
      userId: req.user.id 
    });

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: 'المحادثة غير موجودة'
      });
    }

    res.json({
      success: true,
      data: { chat }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'حدث خطأ',
      error: error.message
    });
  }
});

// @route   POST /api/chat/sessions/:id/messages
// @desc    Send message in chat
// @access  Private
router.post('/sessions/:id/messages', protect, async (req, res) => {
  try {
    const { content, attachments } = req.body;

    const chat = await Chat.findOne({ 
      _id: req.params.id, 
      userId: req.user.id 
    });

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: 'المحادثة غير موجودة'
      });
    }

    // Add user message
    chat.messages.push({
      role: 'user',
      content,
      attachments: attachments || []
    });

    await chat.save();

    res.json({
      success: true,
      message: 'تم إرسال الرسالة'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'حدث خطأ',
      error: error.message
    });
  }
});

// @route   DELETE /api/chat/sessions/:id
// @desc    Delete chat session
// @access  Private
router.delete('/sessions/:id', protect, async (req, res) => {
  try {
    const chat = await Chat.findOneAndDelete({ 
      _id: req.params.id, 
      userId: req.user.id 
    });

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: 'المحادثة غير موجودة'
      });
    }

    res.json({
      success: true,
      message: 'تم حذف المحادثة'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'حدث خطأ',
      error: error.message
    });
  }
});

module.exports = router;
