const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  agentId: {
    type: String,
    required: true
  },
  agentName: {
    type: String,
    required: true
  },
  agentType: {
    type: String,
    enum: ['general', 'radiology', 'lab', 'cardiology', 'neurology', 'dermatology', 'pediatrics', 'consultant'],
    default: 'general'
  },
  messages: [{
    role: {
      type: String,
      enum: ['user', 'assistant', 'system'],
      required: true
    },
    content: {
      type: String,
      required: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    attachments: [{
      type: {
        type: String,
        enum: ['image', 'pdf', 'word', 'audio', 'video']
      },
      url: String,
      filename: String,
      size: Number,
      mimeType: String
    }],
    analysis: {
      diagnosis: String,
      recommendations: [String],
      confidence: Number,
      references: [String]
    }
  }],
  status: {
    type: String,
    enum: ['active', 'completed', 'archived'],
    default: 'active'
  },
  summary: {
    type: String
  },
  diagnosis: {
    type: String
  },
  recommendations: [{
    type: String
  }],
  uploadedFiles: [{
    fileId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'MedicalFile'
    },
    filename: String,
    uploadDate: Date,
    fileType: String,
    analysisResult: Object
  }],
  metadata: {
    totalMessages: {
      type: Number,
      default: 0
    },
    duration: {
      type: Number, // in minutes
      default: 0
    },
    satisfaction: {
      type: Number,
      min: 1,
      max: 5
    },
    feedback: String
  }
}, {
  timestamps: true
});

// Indexes
chatSchema.index({ userId: 1, createdAt: -1 });
chatSchema.index({ agentId: 1 });
chatSchema.index({ status: 1 });

// Update total messages before saving
chatSchema.pre('save', function(next) {
  this.metadata.totalMessages = this.messages.length;
  next();
});

module.exports = mongoose.model('Chat', chatSchema);
