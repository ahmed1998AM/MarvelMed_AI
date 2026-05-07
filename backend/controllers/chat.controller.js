const Chat = require('../models/Chat');
const AIAgent = require('../models/AIAgent');
const User = require('../models/User');

// @desc    Create or get chat session
// @route   POST /api/chat/session
// @access  Private
exports.createChatSession = async (req, res) => {
  try {
    const { agentId } = req.body;

    // Find AI agent
    const agent = await AIAgent.findById(agentId);
    
    if (!agent) {
      return res.status(404).json({
        success: false,
        message: 'الوكيل غير موجود'
      });
    }

    // Check if agent is active
    if (!agent.isActive) {
      return res.status(400).json({
        success: false,
        message: 'هذا الوكيل غير متاح حالياً'
      });
    }

    // Create new chat session
    const chat = await Chat.create({
      userId: req.user.id,
      agentId,
      messages: []
    });

    res.status(201).json({
      success: true,
      message: 'تم إنشاء جلسة المحادثة بنجاح',
      data: {
        chat
      }
    });
  } catch (error) {
    console.error('Create chat session error:', error);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ أثناء إنشاء المحادثة',
      error: error.message
    });
  }
};

// @desc    Get user chats
// @route   GET /api/chat
// @access  Private
exports.getUserChats = async (req, res) => {
  try {
    const { page = 1, limit = 10, agentId } = req.query;

    const query = { userId: req.user.id };
    if (agentId) {
      query.agentId = agentId;
    }

    const chats = await Chat.find(query)
      .populate('agentId', 'name specialty avatar')
      .sort('-updatedAt')
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Chat.countDocuments(query);

    res.json({
      success: true,
      data: {
        chats,
        pagination: {
          total: count,
          page: parseInt(page),
          pages: Math.ceil(count / limit)
        }
      }
    });
  } catch (error) {
    console.error('Get chats error:', error);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ أثناء جلب المحادثات',
      error: error.message
    });
  }
};

// @desc    Get single chat
// @route   GET /api/chat/:id
// @access  Private
exports.getChat = async (req, res) => {
  try {
    const chat = await Chat.findOne({ 
      _id: req.params.id, 
      userId: req.user.id 
    }).populate('agentId', 'name specialty avatar description');

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: 'المحادثة غير موجودة'
      });
    }

    res.json({
      success: true,
      data: {
        chat
      }
    });
  } catch (error) {
    console.error('Get chat error:', error);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ أثناء جلب المحادثة',
      error: error.message
    });
  }
};

// @desc    Send message in chat
// @route   POST /api/chat/:id/message
// @access  Private
exports.sendMessage = async (req, res) => {
  try {
    const { message, attachments } = req.body;

    if (!message && !attachments?.length) {
      return res.status(400).json({
        success: false,
        message: 'الرجاء إدخال رسالة أو إرفاق ملف'
      });
    }

    const chat = await Chat.findOne({ 
      _id: req.params.id, 
      userId: req.user.id 
    }).populate('agentId');

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: 'المحادثة غير موجودة'
      });
    }

    // Add user message
    const userMessage = {
      role: 'user',
      content: message || '',
      attachments: attachments || [],
      timestamp: new Date()
    };

    chat.messages.push(userMessage);

    // Generate AI response
    let aiResponse = '';
    
    try {
      // Here you would call your AI service
      // For now, we'll create a placeholder response
      aiResponse = `شكراً لتواصلك. أنا ${chat.agentId.name}، متخصص في ${chat.agentId.specialty}. 

سأقوم بتحليل رسالتك${attachments?.length ? ' والملفات المرفقة' : ''} وسأعود إليك برد مفصل خلال لحظات.

يرجى ملاحظة أن هذا تشخيص أولي ولا يغني عن استشارة الطبيب المعالج.`;
    } catch (aiError) {
      aiResponse = 'عذراً، حدث خطأ أثناء معالجة طلبك. يرجى المحاولة مرة أخرى.';
    }

    // Add AI response
    chat.messages.push({
      role: 'assistant',
      content: aiResponse,
      timestamp: new Date()
    });

    await chat.save();

    res.json({
      success: true,
      message: 'تم إرسال الرسالة بنجاح',
      data: {
        message: userMessage,
        response: chat.messages[chat.messages.length - 1]
      }
    });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ أثناء إرسال الرسالة',
      error: error.message
    });
  }
};

// @desc    Delete chat
// @route   DELETE /api/chat/:id
// @access  Private
exports.deleteChat = async (req, res) => {
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
      message: 'تم حذف المحادثة بنجاح'
    });
  } catch (error) {
    console.error('Delete chat error:', error);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ أثناء حذف المحادثة',
      error: error.message
    });
  }
};

// @desc    Clear chat messages
// @route   POST /api/chat/:id/clear
// @access  Private
exports.clearChat = async (req, res) => {
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

    chat.messages = [];
    await chat.save();

    res.json({
      success: true,
      message: 'تم مسح المحادثة بنجاح'
    });
  } catch (error) {
    console.error('Clear chat error:', error);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ أثناء مسح المحادثة',
      error: error.message
    });
  }
};
