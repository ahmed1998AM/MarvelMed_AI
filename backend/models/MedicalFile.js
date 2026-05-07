const mongoose = require('mongoose');

const medicalFileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  filename: {
    type: String,
    required: true
  },
  originalName: {
    type: String,
    required: true
  },
  fileType: {
    type: String,
    enum: ['pdf', 'word', 'image', 'audio', 'video', 'dicom'],
    required: true
  },
  mimeType: {
    type: String,
    required: true
  },
  size: {
    type: Number,
    required: true
  },
  url: {
    type: String,
    required: true
  },
  thumbnailUrl: String,
  category: {
    type: String,
    enum: ['xray', 'mri', 'ct', 'ultrasound', 'blood_test', 'urine_test', 'biopsy', 'ecg', 'other'],
    default: 'other'
  },
  bodyPart: {
    type: String
  },
  analysisStatus: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed'],
    default: 'pending'
  },
  analysisResult: {
    diagnosis: String,
    findings: [String],
    recommendations: [String],
    confidence: Number,
    aiModel: String,
    processedAt: Date,
    rawResponse: Object
  },
  metadata: {
    width: Number,
    height: Number,
    duration: Number,
    pages: Number,
    resolution: String
  },
  tags: [String],
  isPrivate: {
    type: Boolean,
    default: false
  },
  sharedWith: [{
    userId: mongoose.Schema.Types.ObjectId,
    role: {
      type: String,
      enum: ['view', 'edit', 'download']
    },
    grantedAt: Date
  }],
  chatId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Chat'
  }
}, {
  timestamps: true
});

// Indexes
medicalFileSchema.index({ userId: 1, createdAt: -1 });
medicalFileSchema.index({ category: 1 });
medicalFileSchema.index({ analysisStatus: 1 });

module.exports = mongoose.model('MedicalFile', medicalFileSchema);
