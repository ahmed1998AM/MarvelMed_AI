const mongoose = require('mongoose');

const activityLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  action: {
    type: String,
    required: true,
    enum: ['login', 'logout', 'chat_message', 'file_upload', 'file_download', 'file_delete',
           'profile_update', 'subscription_change', 'payment', 'report_generated',
           'medicine_search', 'medicine_view', 'lab_test_analysis', 'radiology_analysis',
           'settings_change', 'data_export', 'api_call', 'error', 'warning', 'admin_action']
  },
  category: {
    type: String,
    enum: ['authentication', 'chat', 'files', 'profile', 'subscription', 'payment',
           'reports', 'medicine', 'analysis', 'system', 'admin'],
    required: true
  },
  description: {
    type: String,
    required: true
  },
  details: {
    type: Object,
    default: {}
  },
  entityType: {
    type: String,
    enum: ['user', 'chat', 'file', 'medicine', 'report', 'subscription', 'payment', 'system']
  },
  entityId: {
    type: mongoose.Schema.Types.ObjectId
  },
  ipAddress: {
    type: String
  },
  userAgent: {
    type: String
  },
  deviceInfo: {
    type: String
  },
  location: {
    country: String,
    city: String,
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  },
  status: {
    type: String,
    enum: ['success', 'failure', 'pending', 'warning', 'error'],
    default: 'success'
  },
  severity: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'low'
  },
  metadata: {
    sessionId: String,
    requestId: String,
    duration: Number,
    apiEndpoint: String,
    httpMethod: String,
    statusCode: Number
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true
  },
  reviewed: {
    type: Boolean,
    default: false
  },
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  reviewedAt: Date,
  notes: String
}, {
  timestamps: true
});

// Indexes for efficient querying
activityLogSchema.index({ userId: 1, timestamp: -1 });
activityLogSchema.index({ action: 1, timestamp: -1 });
activityLogSchema.index({ category: 1, timestamp: -1 });
activityLogSchema.index({ status: 1, timestamp: -1 });
activityLogSchema.index({ severity: 1, timestamp: -1 });
activityLogSchema.index({ entityType: 1, entityId: 1 });

// Static method to get user activity timeline
activityLogSchema.statics.getUserActivity = async function(userId, options = {}) {
  const { startDate, endDate, category, action, limit = 100, skip = 0 } = options;
  
  const query = { userId };
  
  if (startDate || endDate) {
    query.timestamp = {};
    if (startDate) query.timestamp.$gte = new Date(startDate);
    if (endDate) query.timestamp.$lte = new Date(endDate);
  }
  
  if (category) query.category = category;
  if (action) query.action = action;
  
  return this.find(query)
    .sort({ timestamp: -1 })
    .limit(limit)
    .skip(skip)
    .populate('entityId', 'name filename title');
};

// Static method to get activity statistics
activityLogSchema.statics.getActivityStats = async function(userId, period = '7d') {
  const startDate = new Date();
  
  switch(period) {
    case '24h':
      startDate.setHours(startDate.getHours() - 24);
      break;
    case '7d':
      startDate.setDate(startDate.getDate() - 7);
      break;
    case '30d':
      startDate.setDate(startDate.getDate() - 30);
      break;
    case '90d':
      startDate.setDate(startDate.getDate() - 90);
      break;
  }
  
  const pipeline = [
    { $match: { userId: new mongoose.Types.ObjectId(userId), timestamp: { $gte: startDate } } },
    {
      $group: {
        _id: '$category',
        count: { $sum: 1 },
        actions: { $push: '$action' }
      }
    }
  ];
  
  return this.aggregate(pipeline);
};

// Method to check suspicious activity
activityLogSchema.methods.isSuspicious = function() {
  const suspiciousPatterns = [
    { action: 'login', status: 'failure' },
    { action: 'file_download', severity: 'high' },
    { action: 'api_call', statusCode: { $gte: 400 } }
  ];
  
  return suspiciousPatterns.some(pattern => 
    JSON.stringify(this).includes(JSON.stringify(pattern))
  );
};

module.exports = mongoose.model('ActivityLog', activityLogSchema);
