const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Chat = require('../models/Chat');
const Subscription = require('../models/Subscription');
const Payment = require('../models/Payment');
const AIAgent = require('../models/AIAgent');
const MedicalFile = require('../models/MedicalFile');
const { protect, authorize } = require('../middleware/auth.middleware');

// @route   GET /api/admin/stats
// @desc    Get admin statistics
// @access  Private/Admin
router.get('/stats', protect, authorize('admin'), async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ isActive: true });
    const totalChats = await Chat.countDocuments();
    const totalSubscriptions = await Subscription.countDocuments({ status: 'active' });
    const totalRevenue = await Payment.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    const totalFiles = await MedicalFile.countDocuments();

    res.json({
      success: true,
      data: {
        stats: {
          totalUsers,
          activeUsers,
          totalChats,
          totalSubscriptions,
          totalRevenue: totalRevenue[0]?.total || 0,
          totalFiles
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'حدث خطأ',
      error: error.message
    });
  }
});

// @route   GET /api/admin/users
// @desc    Get all users
// @access  Private/Admin
router.get('/users', protect, authorize('admin'), async (req, res) => {
  try {
    const { page = 1, limit = 20, search = '' } = req.query;
    
    const query = search ? {
      $or: [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ]
    } : {};

    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await User.countDocuments(query);

    res.json({
      success: true,
      count: users.length,
      total: count,
      pages: Math.ceil(count / limit),
      page: parseInt(page),
      data: { users }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'حدث خطأ',
      error: error.message
    });
  }
});

// @route   PUT /api/admin/users/:id
// @desc    Update user
// @access  Private/Admin
router.put('/users/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const { isActive, role, subscription } = req.body;
    
    const updateData = {};
    if (isActive !== undefined) updateData.isActive = isActive;
    if (role !== undefined) updateData.role = role;
    if (subscription) updateData.subscription = subscription;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    res.json({
      success: true,
      message: 'تم تحديث المستخدم',
      data: { user }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'حدث خطأ',
      error: error.message
    });
  }
});

// @route   GET /api/admin/agents
// @desc    Get all AI agents
// @access  Private/Admin
router.get('/agents', protect, authorize('admin'), async (req, res) => {
  try {
    const agents = await AIAgent.find().sort({ order: 1 });

    res.json({
      success: true,
      count: agents.length,
      data: { agents }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'حدث خطأ',
      error: error.message
    });
  }
});

// @route   POST /api/admin/agents
// @desc    Create AI agent
// @access  Private/Admin
router.post('/agents', protect, authorize('admin'), async (req, res) => {
  try {
    const agent = await AIAgent.create(req.body);

    res.status(201).json({
      success: true,
      message: 'تم إنشاء الوكيل',
      data: { agent }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'حدث خطأ',
      error: error.message
    });
  }
});

// @route   PUT /api/admin/agents/:id
// @desc    Update AI agent
// @access  Private/Admin
router.put('/agents/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const agent = await AIAgent.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'تم تحديث الوكيل',
      data: { agent }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'حدث خطأ',
      error: error.message
    });
  }
});

// @route   DELETE /api/admin/agents/:id
// @desc    Delete AI agent
// @access  Private/Admin
router.delete('/agents/:id', protect, authorize('admin'), async (req, res) => {
  try {
    await AIAgent.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'تم حذف الوكيل'
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
