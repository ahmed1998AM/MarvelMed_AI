const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect } = require('../middleware/auth.middleware');

// @route   GET /api/users/profile
// @desc    Get user profile
// @access  Private
router.get('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    res.json({
      success: true,
      data: {
        user: user.getPublicProfile()
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'حدث خطأ أثناء جلب الملف الشخصي',
      error: error.message
    });
  }
});

// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', protect, async (req, res) => {
  try {
    const allowedFields = ['name', 'phone', 'dateOfBirth', 'gender', 'height', 'weight', 'bloodType'];
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

    res.json({
      success: true,
      message: 'تم تحديث الملف الشخصي بنجاح',
      data: { user: user.getPublicProfile() }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'حدث خطأ',
      error: error.message
    });
  }
});

// @route   PUT /api/users/medical-history
// @desc    Update medical history
// @access  Private
router.put('/medical-history', protect, async (req, res) => {
  try {
    const { medicalHistory, allergies, currentMedications, chronicDiseases, surgicalHistory, familyMedicalHistory, lifestyle } = req.body;
    
    const updateData = {};
    if (medicalHistory) updateData.medicalHistory = medicalHistory;
    if (allergies) updateData.allergies = allergies;
    if (currentMedications) updateData.currentMedications = currentMedications;
    if (chronicDiseases) updateData.chronicDiseases = chronicDiseases;
    if (surgicalHistory) updateData.surgicalHistory = surgicalHistory;
    if (familyMedicalHistory) updateData.familyMedicalHistory = familyMedicalHistory;
    if (lifestyle) updateData.lifestyle = lifestyle;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      updateData,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'تم تحديث التاريخ الطبي بنجاح',
      data: { user: user.getPublicProfile() }
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
