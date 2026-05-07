const mongoose = require('mongoose');

const aiAgentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  specialty: {
    type: String,
    enum: ['general', 'radiology', 'lab', 'cardiology', 'neurology', 'dermatology', 'pediatrics', 'oncology', 'orthopedics', 'gastroenterology', 'endocrinology', 'pulmonology', 'nephrology', 'hematology', 'immunology', 'psychiatry', 'consultant'],
    required: true
  },
  avatar: {
    type: String,
    default: ''
  },
  systemPrompt: {
    type: String,
    required: true
  },
  modelProvider: {
    type: String,
    enum: ['openai', 'google', 'anthropic', 'cohere', 'replicate', 'huggingface', 'azure', 'aws', 'local'],
    default: 'openai'
  },
  modelName: {
    type: String,
    default: 'gpt-4'
  },
  temperature: {
    type: Number,
    min: 0,
    max: 2,
    default: 0.7
  },
  maxTokens: {
    type: Number,
    default: 4096
  },
  capabilities: {
    textAnalysis: {
      type: Boolean,
      default: true
    },
    imageAnalysis: {
      type: Boolean,
      default: false
    },
    fileAnalysis: {
      type: Boolean,
      default: false
    },
    voiceChat: {
      type: Boolean,
      default: false
    },
    multiLanguage: {
      type: Boolean,
      default: true
    },
    supportedLanguages: [{
      type: String,
      enum: ['ar', 'en', 'fr', 'de', 'es']
    }]
  },
  settings: {
    requiresSubscription: {
      type: Boolean,
      default: false
    },
    requiredPlan: {
      type: String,
      enum: ['free', 'gold', 'platinum'],
      default: 'free'
    },
    maxConversations: {
      type: Number,
      default: 100
    },
    responseTimeout: {
      type: Number,
      default: 30000
    }
  },
  statistics: {
    totalConversations: {
      type: Number,
      default: 0
    },
    totalMessages: {
      type: Number,
      default: 0
    },
    averageRating: {
      type: Number,
      min: 1,
      max: 5,
      default: 0
    },
    totalRatings: {
      type: Number,
      default: 0
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isDefault: {
    type: Boolean,
    default: false
  },
  order: {
    type: Number,
    default: 0
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Indexes
aiAgentSchema.index({ specialty: 1 });
aiAgentSchema.index({ isActive: 1 });
aiAgentSchema.index({ order: 1 });

module.exports = mongoose.model('AIAgent', aiAgentSchema);
