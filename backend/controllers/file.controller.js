const multer = require('multer');
const path = require('path');
const fs = require('fs');
const MedicalFile = require('../models/MedicalFile');

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const userDir = path.join(uploadsDir, req.user.id);
    if (!fs.existsSync(userDir)) {
      fs.mkdirSync(userDir, { recursive: true });
    }
    cb(null, userDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter for medical files
const fileFilter = (req, file, cb) => {
  // Allowed file types
  const allowedTypes = [
    // Images
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/bmp',
    'image/tiff',
    'image/dicom',
    'application/dicom',
    // Documents
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain'
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('نوع الملف غير مدعوم. يرجى رفع صور أو PDF أو ملفات Word فقط'), false);
  }
};

// Upload middleware
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB limit
  },
  fileFilter: fileFilter
});

// @desc    Upload medical file (X-ray, Lab test, etc.)
// @route   POST /api/files/upload
// @access  Private
exports.uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'لم يتم رفع أي ملف'
      });
    }

    const { type, description, bodyPart } = req.body;

    // Create medical file record
    const medicalFile = await MedicalFile.create({
      userId: req.user.id,
      files: [{
        fileName: req.file.originalname,
        filePath: req.file.path,
        fileType: req.file.mimetype,
        fileSize: req.file.size,
        type: type || 'general',
        description: description || '',
        bodyPart: bodyPart || ''
      }]
    });

    res.status(201).json({
      success: true,
      message: 'تم رفع الملف بنجاح',
      data: {
        file: medicalFile.files[medicalFile.files.length - 1],
        url: `/uploads/${req.user.id}/${req.file.filename}`
      }
    });
  } catch (error) {
    console.error('Upload file error:', error);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ أثناء رفع الملف',
      error: error.message
    });
  }
};

// @desc    Get user medical files
// @route   GET /api/files
// @access  Private
exports.getUserFiles = async (req, res) => {
  try {
    const { type, page = 1, limit = 20 } = req.query;

    const query = { userId: req.user.id };
    
    const medicalFiles = await MedicalFile.find(query)
      .sort('-createdAt')
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await MedicalFile.countDocuments(query);

    // Flatten all files
    let allFiles = [];
    medicalFiles.forEach(mf => {
      mf.files.forEach(file => {
        if (!type || file.type === type) {
          allFiles.push({
            ...file.toObject(),
            medicalFileId: mf._id,
            url: `/uploads/${req.user.id}/${file.fileName}`
          });
        }
      });
    });

    res.json({
      success: true,
      data: {
        files: allFiles,
        pagination: {
          total: count,
          page: parseInt(page),
          pages: Math.ceil(count / limit)
        }
      }
    });
  } catch (error) {
    console.error('Get files error:', error);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ أثناء جلب الملفات',
      error: error.message
    });
  }
};

// @desc    Delete medical file
// @route   DELETE /api/files/:id
// @access  Private
exports.deleteFile = async (req, res) => {
  try {
    const medicalFile = await MedicalFile.findOne({ 
      _id: req.params.id, 
      userId: req.user.id 
    });

    if (!medicalFile) {
      return res.status(404).json({
        success: false,
        message: 'الملف غير موجود'
      });
    }

    // Remove file from array
    medicalFile.files = medicalFile.files.filter(
      file => file._id.toString() !== req.params.fileId
    );

    await medicalFile.save();

    res.json({
      success: true,
      message: 'تم حذف الملف بنجاح'
    });
  } catch (error) {
    console.error('Delete file error:', error);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ أثناء حذف الملف',
      error: error.message
    });
  }
};

module.exports = {
  upload,
  uploadFile,
  getUserFiles,
  deleteFile
};
