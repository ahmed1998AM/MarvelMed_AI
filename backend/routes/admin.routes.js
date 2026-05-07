const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

// Apply authentication and admin authorization to all routes
router.use(protect);
router.use(authorize('admin'));

// @route   GET /api/admin/stats
// @desc    Get dashboard statistics
// @access  Private/Admin
router.get('/stats', adminController.getDashboardStats);

// @route   GET /api/admin/users
// @desc    Get all users
// @access  Private/Admin
router.get('/users', adminController.getAllUsers);

// @route   GET /api/admin/users/:id
// @desc    Get single user
// @access  Private/Admin
router.get('/users/:id', adminController.getUser);

// @route   PUT /api/admin/users/:id
// @desc    Update user
// @access  Private/Admin
router.put('/users/:id', adminController.updateUser);

// @route   DELETE /api/admin/users/:id
// @desc    Delete user
// @access  Private/Admin
router.delete('/users/:id', adminController.deleteUser);

// @route   GET /api/admin/subscriptions
// @desc    Get all subscriptions
// @access  Private/Admin
router.get('/subscriptions', adminController.getAllSubscriptions);

// @route   GET /api/admin/payments
// @desc    Get all payments
// @access  Private/Admin
router.get('/payments', adminController.getAllPayments);

module.exports = router;
