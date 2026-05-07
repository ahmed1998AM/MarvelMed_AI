const User = require('../models/User');
const MedicalFile = require('../models/MedicalFile');
const jwt = require('jsonwebtoken');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'tabib-al-ajaeib-secret-key-2024', {
    expiresIn: process.env.JWT_EXPIRE || '30d'
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
  try {
    const { 
      name, 
      email, 
      password, 
      phone, 
      dateOfBirth, 
      gender,
      height,
      weight,
      bloodType
    } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'الاسم والبريد الإلكتروني وكلمة المرور مطلوبة'
      });
    }

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'هذا البريد الإلكتروني مسجل بالفعل'
      });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      phone,
      dateOfBirth,
      gender,
      height,
      weight,
      bloodType
    });

    // Create medical file for user
    await MedicalFile.create({
      userId: user._id,
      basicInfo: {
        height: user.height,
        weight: user.weight,
        bloodType: user.bloodType,
        dateOfBirth: user.dateOfBirth,
        gender: user.gender
      }
    });

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'تم إنشاء الحساب بنجاح',
      data: {
        user: user.getPublicProfile(),
        token
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ أثناء إنشاء الحساب',
      error: error.message
    });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'البريد الإلكتروني وكلمة المرور مطلوبة'
      });
    }

    // Find user and include password
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'البريد الإلكتروني أو كلمة المرور غير صحيحة'
      });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'الحساب غير مفعل'
      });
    }

    // Check password
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'البريد الإلكتروني أو كلمة المرور غير صحيحة'
      });
    }

    // Update last login
    user.lastLogin = new Date();
    user.loginCount += 1;
    await user.save();

    // Generate token
    const token = generateToken(user._id);

    res.json({
      success: true,
      message: 'تم تسجيل الدخول بنجاح',
      data: {
        user: user.getPublicProfile(),
        token
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ أثناء تسجيل الدخول',
      error: error.message
    });
  }
};

// @desc    Social login (Google, Facebook, GitHub)
// @route   POST /api/auth/social-login
// @access  Public
exports.socialLogin = async (req, res) => {
  try {
    const { provider, accessToken, profile } = req.body;

    if (!provider || !profile || !profile.email) {
      return res.status(400).json({
        success: false,
        message: 'بيانات التسجيل غير كاملة'
      });
    }

    // Find existing user
    let user = await User.findOne({ 
      [`socialAuth.${provider}.email`]: profile.email 
    });

    if (user) {
      // Update last login
      user.lastLogin = new Date();
      user.loginCount += 1;
      await user.save();

      const token = generateToken(user._id);

      return res.json({
        success: true,
        message: 'تم تسجيل الدخول بنجاح',
        data: {
          user: user.getPublicProfile(),
          token
        }
      });
    }

    // Create new user
    user = await User.create({
      name: profile.name || profile.displayName,
      email: profile.email,
      isVerified: true,
      socialAuth: {
        [provider]: {
          id: profile.id,
          email: profile.email,
          verified: true
        }
      }
    });

    // Create medical file
    await MedicalFile.create({
      userId: user._id,
      basicInfo: {
        gender: profile.gender || 'other'
      }
    });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'تم إنشاء الحساب وتسجيل الدخول بنجاح',
      data: {
        user: user.getPublicProfile(),
        token
      }
    });
  } catch (error) {
    console.error('Social login error:', error);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ أثناء تسجيل الدخول الاجتماعي',
      error: error.message
    });
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    res.json({
      success: true,
      data: {
        user: user.getPublicProfile()
      }
    });
  } catch (error) {
    console.error('Get me error:', error);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ أثناء جلب البيانات',
      error: error.message
    });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/update-profile
// @access  Private
exports.updateProfile = async (req, res) => {
  try {
    const allowedFields = ['name', 'phone', 'dateOfBirth', 'gender', 'height', 'weight', 'bloodType', 'medicalHistory', 'allergies', 'currentMedications', 'chronicDiseases', 'emergencyContact', 'preferences'];
    
    const updateData = {};
    Object.keys(req.body).forEach(key => {
      if (allowedFields.includes(key)) {
        updateData[key] = req.body[key];
      }
    });

    const user = await User.findByIdAndUpdate(
      req.user.id,
      updateData,
      { new: true, runValidators: true }
    );

    // Update medical file if needed
    if (updateData.height || updateData.weight || updateData.bloodType || updateData.dateOfBirth || updateData.gender) {
      await MedicalFile.findOneAndUpdate(
        { userId: req.user.id },
        {
          basicInfo: {
            height: updateData.height,
            weight: updateData.weight,
            bloodType: updateData.bloodType,
            dateOfBirth: updateData.dateOfBirth,
            gender: updateData.gender
          }
        },
        { upsert: true }
      );
    }

    res.json({
      success: true,
      message: 'تم تحديث الملف الشخصي بنجاح',
      data: {
        user: user.getPublicProfile()
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ أثناء تحديث الملف الشخصي',
      error: error.message
    });
  }
};

// @desc    Forgot password
// @route   POST /api/auth/forgot-password
// @access  Public
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'لا يوجد حساب بهذا البريد الإلكتروني'
      });
    }

    // Generate reset token
    const resetToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // TODO: Send email with reset token

    res.json({
      success: true,
      message: 'تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني',
      data: { resetToken } // Remove in production
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ',
      error: error.message
    });
  }
};

// @desc    Reset password
// @route   POST /api/auth/reset-password
// @access  Public
exports.resetPassword = async (req, res) => {
  try {
    const { resetToken, newPassword } = req.body;

    if (!resetToken || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'الرجاء إدخال جميع البيانات المطلوبة'
      });
    }

    // Verify token
    const decoded = jwt.verify(resetToken, process.env.JWT_SECRET);
    
    const user = await User.findById(decoded.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'المستخدم غير موجود'
      });
    }

    user.password = newPassword;
    await user.save();

    res.json({
      success: true,
      message: 'تم إعادة تعيين كلمة المرور بنجاح'
    });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({
      success: false,
      message: 'رابط إعادة التعيين غير صالح أو منتهي الصلاحية',
      error: error.message
    });
  }
};
