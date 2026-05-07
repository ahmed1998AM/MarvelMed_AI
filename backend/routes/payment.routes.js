const express = require('express');
const router = express.Router();
const Payment = require('../models/Payment');
const Subscription = require('../models/Subscription');
const { protect } = require('../middleware/auth.middleware');

// @route   POST /api/payments/initiate
// @desc    Initiate payment for subscription
// @access  Private
router.post('/initiate', protect, async (req, res) => {
  try {
    const { plan, paymentMethod, billingDetails } = req.body;

    const prices = {
      free: 0,
      gold: 99,
      platinum: 199
    };

    const payment = await Payment.create({
      userId: req.user.id,
      amount: prices[plan] || 0,
      currency: 'EGP',
      status: 'pending',
      paymentMethod,
      billingDetails
    });

    res.json({
      success: true,
      message: 'تم إنشاء طلب الدفع',
      data: { payment }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'حدث خطأ',
      error: error.message
    });
  }
});

// @route   POST /api/payments/confirm
// @desc    Confirm payment and activate subscription
// @access  Private
router.post('/confirm', protect, async (req, res) => {
  try {
    const { paymentId, transactionId } = req.body;

    const payment = await Payment.findOne({ 
      _id: paymentId, 
      userId: req.user.id 
    });

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'طلب الدفع غير موجود'
      });
    }

    payment.status = 'completed';
    payment.transactionId = transactionId;
    await payment.save();

    // Activate subscription
    const subscription = await Subscription.findOneAndUpdate(
      { userId: req.user.id, status: 'pending' },
      { status: 'active' },
      { new: true }
    );

    res.json({
      success: true,
      message: 'تم تأكيد الدفع وتفعيل الاشتراك',
      data: { payment, subscription }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'حدث خطأ',
      error: error.message
    });
  }
});

// @route   GET /api/payments/history
// @desc    Get payment history
// @access  Private
router.get('/history', protect, async (req, res) => {
  try {
    const payments = await Payment.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .limit(50);

    res.json({
      success: true,
      count: payments.length,
      data: { payments }
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
