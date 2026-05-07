const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const MedicalFile = require('../models/MedicalFile');
const { protect } = require('../middleware/auth.middleware');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../../uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx|txt|mp3|wav|dcm/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);
  
  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error('نوع الملف غير مدعوم'));
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
  fileFilter: fileFilter
});

// @route   POST /api/files/upload
// @desc    Upload medical file
// @access  Private
router.post('/upload', protect, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'لم يتم رفع أي ملف'
      });
    }

    const fileType = req.file.mimetype.split('/')[0];
    const category = getCategoryFromMimetype(req.file.mimetype);

    const medicalFile = await MedicalFile.create({
      userId: req.user.id,
      filename: req.file.filename,
      originalName: req.file.originalname,
      fileType: getFileType(req.file.originalname),
      mimeType: req.file.mimetype,
      size: req.file.size,
      url: `/uploads/${req.file.filename}`,
      category: category
    });

    res.status(201).json({
      success: true,
      message: 'تم رفع الملف بنجاح',
      data: { file: medicalFile }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'حدث خطأ أثناء رفع الملف',
      error: error.message
    });
  }
});

// @route   GET /api/files
// @desc    Get all user files
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const files = await MedicalFile.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .limit(100);

    res.json({
      success: true,
      count: files.length,
      data: { files }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'حدث خطأ',
      error: error.message
    });
  }
});

// @route   GET /api/files/:id
// @desc    Get single file
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const file = await MedicalFile.findOne({ 
      _id: req.params.id, 
      userId: req.user.id 
    });

    if (!file) {
      return res.status(404).json({
        success: false,
        message: 'الملف غير موجود'
      });
    }

    res.json({
      success: true,
      data: { file }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'حدث خطأ',
      error: error.message
    });
  }
});

// @route   DELETE /api/files/:id
// @desc    Delete file
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const file = await MedicalFile.findOneAndDelete({ 
      _id: req.params.id, 
      userId: req.user.id 
    });

    if (!file) {
      return res.status(404).json({
        success: false,
        message: 'الملف غير موجود'
      });
    }

    // Delete physical file
    const filePath = path.join(__dirname, '../../uploads', file.filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    res.json({
      success: true,
      message: 'تم حذف الملف'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'حدث خطأ',
      error: error.message
    });
  }
});

// Helper functions
function getFileType(filename) {
  const ext = path.extname(filename).toLowerCase().replace('.', '');
  if (['jpg', 'jpeg', 'png', 'gif'].includes(ext)) return 'image';
  if (['pdf'].includes(ext)) return 'pdf';
  if (['doc', 'docx'].includes(ext)) return 'word';
  if (['mp3', 'wav'].includes(ext)) return 'audio';
  if (['dcm'].includes(ext)) return 'dicom';
  return 'other';
}

function getCategoryFromMimetype(mimetype) {
  if (mimetype.includes('image')) return 'xray';
  if (mimetype.includes('pdf')) return 'blood_test';
  return 'other';
}

module.exports = router;
