const express = require('express');
const router = express.Router();
const Subscription = require('../models/Subscription');
const { protect } = require('../middleware/auth.middleware');

// @route   GET /api/subscriptions/plans
// @desc    Get all subscription plans
// @access  Public
router.get('/plans', async (req, res) => {
  const plans = [
    {
      id: 'free',
      name: 'مجاني',
      price: 0,
      currency: 'EGP',
      period: 'دائم',
      features: [
        '5 محادثات شهرياً',
        'وكيل ذكاء اصطناعي عام',
        'رفع 3 ملفات شهرياً',
        'حجم ملف حتى 5 ميجابايت',
        'دعم أساسي'
      ],
      limitations: {
        maxChatsPerMonth: 5,
        maxFileUploads: 3,
        maxFileSize: 5
      }
    },
    {
      id: 'gold',
      name: 'ذهبي',
      price: 99,
      currency: 'EGP',
      period: 'شهرياً',
      features: [
        '50 محادثة شهرياً',
        'جميع وكلاء الذكاء الاصطناعي',
        'رفع 20 ملف شهرياً',
        'حجم ملف حتى 20 ميجابايت',
        'تحليل متقدم للأشعة',
        'تقارير PDF',
        'دعم عبر البريد'
      ],
      popular: true,
      limitations: {
        maxChatsPerMonth: 50,
        maxFileUploads: 20,
        maxFileSize: 20
      }
    },
    {
      id: 'platinum',
      name: 'بلاتيني',
      price: 199,
      currency: 'EGP',
      period: 'شهرياً',
      features: [
        'محادثات غير محدودة',
        'جميع وكلاء الذكاء الاصطناعي',
        'رفع ملفات غير محدود',
        'حجم ملف حتى 50 ميجابايت',
        'تحليل متقدم لجميع الملفات',
        'وكيل استشاري',
        'تقارير PDF مفصلة',
        'دعم ذو أولوية',
        'حسابات عائلية (3)'
      ],
      limitations: {
        maxChatsPerMonth: -1,
        maxFileUploads: -1,
        maxFileSize: 50,
        familyAccounts: 3
      }
    }
  ];

  res.json({
    success: true,
    data: { plans }
  });
});

// @route   GET /api/subscriptions/my-subscription
// @desc    Get user's current subscription
// @access  Private
router.get('/my-subscription', protect, async (req, res) => {
  try {
    const subscription = await Subscription.findOne({ 
      userId: req.user.id,
      status: 'active'
    }).sort({ endDate: -1 });

    res.json({
      success: true,
      data: { subscription }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'حدث خطأ',
      error: error.message
    });
  }
});

// @route   POST /api/subscriptions/subscribe
// @desc    Create new subscription
// @access  Private
router.post('/subscribe', protect, async (req, res) => {
  try {
    const { plan, paymentMethod } = req.body;

    const prices = {
      free: 0,
      gold: 99,
      platinum: 199
    };

    const startDate = new Date();
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + 1);

    const subscription = await Subscription.create({
      userId: req.user.id,
      plan,
      status: plan === 'free' ? 'active' : 'pending',
      startDate,
      endDate,
      price: prices[plan],
      paymentMethod: paymentMethod || 'cash'
    });

    res.status(201).json({
      success: true,
      message: plan === 'free' ? 'تم تفعيل الخطة المجانية' : 'تم إنشاء الاشتراك، يرجى إتمام الدفع',
      data: { subscription }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'حدث خطأ',
      error: error.message
    });
  }
});

// @route   PUT /api/subscriptions/cancel
// @desc    Cancel subscription
// @access  Private
router.put('/cancel', protect, async (req, res) => {
  try {
    const subscription = await Subscription.findOne({ 
      userId: req.user.id,
      status: 'active'
    });

    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: 'لا يوجد اشتراك نشط'
      });
    }

    subscription.status = 'cancelled';
    subscription.cancelledAt = new Date();
    await subscription.save();

    res.json({
      success: true,
      message: 'تم إلغاء الاشتراك بنجاح'
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
