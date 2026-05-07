const Subscription = require('../models/Subscription');
const Payment = require('../models/Payment');
const User = require('../models/User');

// @desc    Get available subscription plans
// @route   GET /api/subscriptions/plans
// @access  Public
exports.getPlans = async (req, res) => {
  try {
    const plans = [
      {
        id: 'free',
        name: 'مجاني',
        price: 0,
        currency: 'EGP',
        duration: 'lifetime',
        features: [
          '5 محادثات يومياً مع الوكيل العام',
          'تحليل أساسي للأشعة والتحاليل',
          'ملف طبي أساسي',
          'دعم عبر البريد الإلكتروني'
        ],
        limitations: {
          dailyChats: 5,
          fileUploads: 10,
          aiProviders: ['basic']
        }
      },
      {
        id: 'gold',
        name: 'ذهبي',
        price: 99,
        currency: 'EGP',
        duration: 'monthly',
        features: [
          '50 محادثة يومياً مع جميع الوكلاء',
          'تحليل متقدم للأشعة والتحاليل',
          'ملف طبي متكامل',
          'دعم فني متميز',
          'تقارير طبية مفصلة',
          'إمكانية رفع 100 ملف شهرياً'
        ],
        limitations: {
          dailyChats: 50,
          fileUploads: 100,
          aiProviders: ['openai', 'google', 'anthropic']
        }
      },
      {
        id: 'platinum',
        name: 'بلاتيني',
        price: 199,
        currency: 'EGP',
        duration: 'monthly',
        features: [
          'محادثات غير محدودة مع جميع الوكلاء',
          'تحليل متقدم جداً بالذكاء الاصطناعي',
          'ملف طبي شامل مع تاريخ مرضي',
          'دعم فني على مدار الساعة',
          'تقارير طبية شاملة ومفصلة',
          'رفع ملفات غير محدود',
          'استشارات مع وكلاء استشاريين',
          'دعم الصوت والمراسلة الفورية'
        ],
        limitations: {
          dailyChats: -1, // unlimited
          fileUploads: -1, // unlimited
          aiProviders: 'all'
        }
      }
    ];

    res.json({
      success: true,
      data: { plans }
    });
  } catch (error) {
    console.error('Get plans error:', error);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ أثناء جلب خطط الاشتراك',
      error: error.message
    });
  }
};

// @desc    Get user's current subscription
// @route   GET /api/subscriptions/current
// @access  Private
exports.getCurrentSubscription = async (req, res) => {
  try {
    const subscription = await Subscription.findOne({
      userId: req.user.id,
      status: 'active',
      endDate: { $gte: new Date() }
    }).sort('-createdAt');

    if (!subscription) {
      return res.json({
        success: true,
        data: {
          subscription: null,
          plan: 'free'
        }
      });
    }

    res.json({
      success: true,
      data: { subscription }
    });
  } catch (error) {
    console.error('Get current subscription error:', error);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ أثناء جلب الاشتراك الحالي',
      error: error.message
    });
  }
};

// @desc    Subscribe to a plan
// @route   POST /api/subscriptions/subscribe
// @access  Private
exports.subscribe = async (req, res) => {
  try {
    const { planId, paymentMethod, paymentDetails } = req.body;

    if (!planId) {
      return res.status(400).json({
        success: false,
        message: 'الرجاء اختيار خطة اشتراك'
      });
    }

    // Cancel any active subscriptions
    await Subscription.updateMany(
      { userId: req.user.id, status: 'active' },
      { status: 'cancelled' }
    );

    // Calculate dates based on plan
    let startDate = new Date();
    let endDate;
    
    if (planId === 'gold' || planId === 'platinum') {
      endDate = new Date(startDate);
      endDate.setMonth(endDate.getMonth() + 1);
    } else {
      endDate = null; // lifetime for free plan
    }

    // Create subscription
    const subscription = await Subscription.create({
      userId: req.user.id,
      plan: planId,
      status: 'pending',
      startDate,
      endDate
    });

    // Create payment record
    const payment = await Payment.create({
      userId: req.user.id,
      subscriptionId: subscription._id,
      amount: planId === 'free' ? 0 : (planId === 'gold' ? 99 : 199),
      currency: 'EGP',
      method: paymentMethod || 'cash',
      status: planId === 'free' ? 'completed' : 'pending',
      details: paymentDetails || {}
    });

    // Update subscription status if free
    if (planId === 'free') {
      subscription.status = 'active';
      await subscription.save();
    }

    res.status(201).json({
      success: true,
      message: planId === 'free' ? 'تم تفعيل الاشتراك المجاني بنجاح' : 'تم إنشاء طلب الاشتراك، يرجى إتمام الدفع',
      data: {
        subscription,
        payment
      }
    });
  } catch (error) {
    console.error('Subscribe error:', error);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ أثناء الاشتراك',
      error: error.message
    });
  }
};

// @desc    Cancel subscription
// @route   POST /api/subscriptions/cancel
// @access  Private
exports.cancelSubscription = async (req, res) => {
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
    console.error('Cancel subscription error:', error);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ أثناء إلغاء الاشتراك',
      error: error.message
    });
  }
};

// @desc    Get subscription history
// @route   GET /api/subscriptions/history
// @access  Private
exports.getHistory = async (req, res) => {
  try {
    const subscriptions = await Subscription.find({
      userId: req.user.id
    })
    .populate('paymentId')
    .sort('-createdAt');

    res.json({
      success: true,
      data: { subscriptions }
    });
  } catch (error) {
    console.error('Get history error:', error);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ أثناء جلب سجل الاشتراكات',
      error: error.message
    });
  }
};

module.exports = {
  getPlans,
  getCurrentSubscription,
  subscribe,
  cancelSubscription,
  getHistory
};
