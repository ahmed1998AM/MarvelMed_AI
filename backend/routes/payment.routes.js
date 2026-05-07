const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/payment.controller');
const { protect } = require('../middleware/auth.middleware');

// All routes require authentication
router.use(protect);

// @route   POST /api/payments/process
// @desc    Process payment for subscription
// @access  Private
router.post('/process', paymentController.processPayment);

// @route   GET /api/payments
// @desc    Get user payments
// @access  Private
router.get('/', paymentController.getUserPayments);

// @route   GET /api/payments/:id
// @desc    Get single payment
// @access  Private
router.get('/:id', paymentController.getPayment);

module.exports = router;
