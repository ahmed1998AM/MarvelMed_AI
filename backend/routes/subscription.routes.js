const express = require('express');
const router = express.Router();
const subscriptionController = require('../controllers/subscription.controller');
const { protect } = require('../middleware/auth.middleware');

// @route   GET /api/subscriptions/plans
// @desc    Get available subscription plans
// @access  Public
router.get('/plans', subscriptionController.getPlans);

// All routes below require authentication
router.use(protect);

// @route   GET /api/subscriptions/current
// @desc    Get user's current subscription
// @access  Private
router.get('/current', subscriptionController.getCurrentSubscription);

// @route   POST /api/subscriptions/subscribe
// @desc    Subscribe to a plan
// @access  Private
router.post('/subscribe', subscriptionController.subscribe);

// @route   POST /api/subscriptions/cancel
// @desc    Cancel subscription
// @access  Private
router.post('/cancel', subscriptionController.cancelSubscription);

// @route   GET /api/subscriptions/history
// @desc    Get subscription history
// @access  Private
router.get('/history', subscriptionController.getHistory);

module.exports = router;
