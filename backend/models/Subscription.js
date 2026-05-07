const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  plan: {
    type: String,
    enum: ['free', 'gold', 'platinum'],
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'expired', 'cancelled', 'pending'],
    default: 'pending'
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    default: 'EGP'
  },
  paymentMethod: {
    type: String,
    enum: ['credit_card', 'debit_card', 'fawry', 'vodafone_cash', 'etisalat_cash', 'orange_cash', 'we_cash', 'masary', 'bank_transfer', 'cash']
  },
  transactionId: String,
  autoRenew: {
    type: Boolean,
    default: false
  },
  features: {
    maxChatsPerMonth: Number,
    maxFileUploads: Number,
    maxFileSize: Number,
    aiAgents: [String],
    prioritySupport: Boolean,
    advancedAnalysis: Boolean,
    downloadReports: Boolean,
    familyAccounts: Number
  },
  usage: {
    chatsUsed: {
      type: Number,
      default: 0
    },
    filesUploaded: {
      type: Number,
      default: 0
    },
    storageUsed: {
      type: Number,
      default: 0
    }
  },
  cancellationReason: String,
  cancelledAt: Date,
  renewedFrom: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subscription'
  }
}, {
  timestamps: true
});

// Indexes
subscriptionSchema.index({ userId: 1, status: 1 });
subscriptionSchema.index({ endDate: 1 });
subscriptionSchema.index({ status: 1 });

// Check if subscription is active
subscriptionSchema.methods.isActive = function() {
  return this.status === 'active' && this.endDate > new Date();
};

// Calculate days remaining
subscriptionSchema.methods.getDaysRemaining = function() {
  const now = new Date();
  const end = new Date(this.endDate);
  const diffTime = end - now;
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

module.exports = mongoose.model('Subscription', subscriptionSchema);
