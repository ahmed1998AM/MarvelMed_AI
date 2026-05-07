const express = require('express');
const router = express.Router();
const User = require('../models/User');
const MedicalFile = require('../models/MedicalFile');
const { protect } = require('../middleware/auth.middleware');

// All routes require authentication
router.use(protect);

// @route   GET /api/users/profile
// @desc    Get user profile with medical file
// @access  Private
router.get('/profile', async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    
    const medicalFile = await MedicalFile.findOne({ userId: req.user.id });

    res.json({
      success: true,
      data: {
        user,
        medicalFile
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ أثناء جلب الملف الشخصي',
      error: error.message
    });
  }
});

// @route   PUT /api/users/profile
// @desc    Update user profile and medical file
// @access  Private
router.put('/profile', async (req, res) => {
  try {
    const { 
      name, phone, dateOfBirth, gender, height, weight, bloodType,
      medicalHistory, allergies, currentMedications, chronicDiseases,
      emergencyContact, preferences 
    } = req.body;

    // Update user
    const userUpdateData = {};
    if (name) userUpdateData.name = name;
    if (phone) userUpdateData.phone = phone;
    if (dateOfBirth) userUpdateData.dateOfBirth = dateOfBirth;
    if (gender) userUpdateData.gender = gender;
    if (height) userUpdateData.height = height;
    if (weight) userUpdateData.weight = weight;
    if (bloodType) userUpdateData.bloodType = bloodType;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      userUpdateData,
      { new: true, runValidators: true }
    ).select('-password');

    // Update or create medical file
    const medicalFileUpdateData = {
      basicInfo: {
        height,
        weight,
        bloodType,
        dateOfBirth,
        gender
      }
    };

    if (medicalHistory) medicalFileUpdateData.medicalHistory = medicalHistory;
    if (allergies) medicalFileUpdateData.allergies = allergies;
    if (currentMedications) medicalFileUpdateData.currentMedications = currentMedications;
    if (chronicDiseases) medicalFileUpdateData.chronicDiseases = chronicDiseases;
    if (emergencyContact) medicalFileUpdateData.emergencyContact = emergencyContact;
    if (preferences) medicalFileUpdateData.preferences = preferences;

    const medicalFile = await MedicalFile.findOneAndUpdate(
      { userId: req.user.id },
      medicalFileUpdateData,
      { new: true, upsert: true }
    );

    res.json({
      success: true,
      message: 'تم تحديث الملف الشخصي بنجاح',
      data: {
        user,
        medicalFile
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
});

// @route   GET /api/users/medical-file
// @desc    Get user medical file
// @access  Private
router.get('/medical-file', async (req, res) => {
  try {
    const medicalFile = await MedicalFile.findOne({ userId: req.user.id })
      .populate('files.uploadedBy', 'name');

    if (!medicalFile) {
      return res.json({
        success: true,
        data: { medicalFile: null }
      });
    }

    res.json({
      success: true,
      data: { medicalFile }
    });
  } catch (error) {
    console.error('Get medical file error:', error);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ أثناء جلب الملف الطبي',
      error: error.message
    });
  }
});

// @route   POST /api/users/medical-file/update-history
// @desc    Update medical history
// @access  Private
router.post('/medical-file/update-history', async (req, res) => {
  try {
    const { condition, diagnosisDate, doctor, notes, attachments } = req.body;

    if (!condition) {
      return res.status(400).json({
        success: false,
        message: 'الرجاء إدخال الحالة المرضية'
      });
    }

    let medicalFile = await MedicalFile.findOne({ userId: req.user.id });

    if (!medicalFile) {
      medicalFile = await MedicalFile.create({
        userId: req.user.id,
        medicalHistory: [{
          condition,
          diagnosisDate: diagnosisDate || new Date(),
          doctor,
          notes,
          attachments: attachments || []
        }]
      });
    } else {
      medicalFile.medicalHistory.push({
        condition,
        diagnosisDate: diagnosisDate || new Date(),
        doctor,
        notes,
        attachments: attachments || []
      });
      await medicalFile.save();
    }

    res.json({
      success: true,
      message: 'تم إضافة السجل الطبي بنجاح',
      data: { medicalFile }
    });
  } catch (error) {
    console.error('Update medical history error:', error);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ أثناء إضافة السجل الطبي',
      error: error.message
    });
  }
});

module.exports = router;
