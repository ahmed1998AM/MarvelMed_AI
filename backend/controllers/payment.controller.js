const Payment = require('../models/Payment');
const Subscription = require('../models/Subscription');

// @desc    Process payment for subscription
// @route   POST /api/payments/process
// @access  Private
exports.processPayment = async (req, res) => {
  try {
    const { paymentId, method, details } = req.body;

    const payment = await Payment.findById(paymentId).populate('subscriptionId');

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'الدفعة غير موجودة'
      });
    }

    if (payment.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'غير مصرح لك بالوصول إلى هذه الدفعة'
      });
    }

    if (payment.status === 'completed') {
      return res.json({
        success: true,
        message: 'تم الدفع بالفعل',
        data: { payment }
      });
    }

    // Simulate payment processing based on method
    let paymentSuccess = true;
    let transactionId = 'TXN-' + Date.now();

    switch (method) {
      case 'vodafone_cash':
      case 'etisalat_cash':
      case 'orange_cash':
      case 'we_cash':
        // Mobile wallet payment
        if (!details?.phoneNumber || !details?.otp) {
          return res.status(400).json({
            success: false,
            message: 'الرجاء إدخال رقم الهاتف ورمز التحقق'
          });
        }
        transactionId = `MOB-${Date.now()}`;
        break;

      case 'fawry':
        // Fawry payment
        if (!details?.fawryCode) {
          return res.status(400).json({
            success: false,
            message: 'الرجاء إدخال كود فوري'
          });
        }
        transactionId = `FW-${details.fawryCode}`;
        break;

      case 'meeza':
        // Meeza card
        if (!details?.cardNumber || !details?.cvv) {
          return res.status(400).json({
            success: false,
            message: 'الرجاء إدخال بيانات البطاقة'
          });
        }
        transactionId = `MZ-${Date.now()}`;
        break;

      case 'credit_card':
        // Credit card
        if (!details?.cardNumber || !details?.cvv || !details?.expiry) {
          return res.status(400).json({
            success: false,
            message: 'الرجاء إدخال بيانات البطاقة الكاملة'
          });
        }
        transactionId = `CC-${Date.now()}`;
        break;

      default:
        paymentSuccess = false;
        break;
    }

    if (paymentSuccess) {
      // Update payment status
      payment.status = 'completed';
      payment.transactionId = transactionId;
      payment.paidAt = new Date();
      payment.details = { ...payment.details, ...details };
      await payment.save();

      // Update subscription status
      if (payment.subscriptionId) {
        const subscription = await Subscription.findById(payment.subscriptionId);
        if (subscription) {
          subscription.status = 'active';
          await subscription.save();
        }
      }

      res.json({
        success: true,
        message: 'تمت عملية الدفع بنجاح',
        data: { payment, transactionId }
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'فشل معالجة الدفع',
        data: { payment }
      });
    }
  } catch (error) {
    console.error('Process payment error:', error);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ أثناء معالجة الدفع',
      error: error.message
    });
  }
};

// @desc    Get user payments
// @route   GET /api/payments
// @access  Private
exports.getUserPayments = async (req, res) => {
  try {
    const { page = 1, limit = 20, status } = req.query;

    const query = { userId: req.user.id };
    if (status) query.status = status;

    const payments = await Payment.find(query)
      .populate('subscriptionId', 'plan startDate endDate')
      .sort('-createdAt')
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Payment.countDocuments(query);

    res.json({
      success: true,
      data: {
        payments,
        pagination: {
          total: count,
          page: parseInt(page),
          pages: Math.ceil(count / limit)
        }
      }
    });
  } catch (error) {
    console.error('Get payments error:', error);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ أثناء جلب المدفوعات',
      error: error.message
    });
  }
};

// @desc    Get single payment
// @route   GET /api/payments/:id
// @access  Private
exports.getPayment = async (req, res) => {
  try {
    const payment = await Payment.findOne({
      _id: req.params.id,
      userId: req.user.id
    }).populate('subscriptionId');

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'الدفعة غير موجودة'
      });
    }

    res.json({
      success: true,
      data: { payment }
    });
  } catch (error) {
    console.error('Get payment error:', error);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ أثناء جلب الدفعة',
      error: error.message
    });
  }
};

module.exports = {
  processPayment,
  getUserPayments,
  getPayment
};
