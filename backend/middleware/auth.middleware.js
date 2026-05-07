const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.protect = async (req, res, next) => {
  try {
    let token;

    // Check for token in headers
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'غير مصرح لك بالدخول، يرجى تسجيل الدخول'
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'tabib-al-ajaeib-secret-key-2024');

    // Get user from token
    req.user = await User.findById(decoded.id);

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'المستخدم غير موجود'
      });
    }

    if (!req.user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'الحساب غير مفعل'
      });
    }

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'غير مصرح لك بالدخول',
      error: error.message
    });
  }
};

// Authorize specific roles
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `ليس لديك الصلاحية للوصول إلى هذه الصفحة (${req.user.role})`
      });
    }
    next();
  };
};

// Rate limiter middleware
exports.rateLimiter = (maxRequests = 100, windowMs = 60000) => {
  const requests = new Map();

  return (req, res, next) => {
    const key = req.ip || req.connection.remoteAddress;
    const now = Date.now();
    const windowStart = now - windowMs;

    if (!requests.has(key)) {
      requests.set(key, []);
    }

    const userRequests = requests.get(key).filter(timestamp => timestamp > windowStart);

    if (userRequests.length >= maxRequests) {
      return res.status(429).json({
        success: false,
        message: 'عدد كبير من الطلبات، يرجى المحاولة لاحقاً'
      });
    }

    userRequests.push(now);
    requests.set(key, userRequests);

    next();
  };
};

// File upload validation
exports.validateFileUpload = (allowedTypes, maxSizeMB = 10) => {
  return (req, res, next) => {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'لم يتم رفع أي ملفات'
      });
    }

    const file = req.files[0];
    const fileSizeMB = file.size / (1024 * 1024);

    if (fileSizeMB > maxSizeMB) {
      return res.status(400).json({
        success: false,
        message: `حجم الملف كبير جداً. الحد الأقصى هو ${maxSizeMB} ميجابايت`
      });
    }

    const fileExtension = file.originalname.split('.').pop().toLowerCase();
    if (!allowedTypes.includes(fileExtension)) {
      return res.status(400).json({
        success: false,
        message: `نوع الملف غير مدعوم. الأنواع المسموحة: ${allowedTypes.join(', ')}`
      });
    }

    next();
  };
};

// Input validation helper
exports.validateInput = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    
    if (error) {
      const messages = error.details.map(detail => detail.message);
      return res.status(400).json({
        success: false,
        message: messages.join('، ')
      });
    }

    next();
  };
};
