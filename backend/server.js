const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const dotenv = require('dotenv');
const path = require('path');
const config = require('./config');

// Import routes
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const chatRoutes = require('./routes/chat.routes');
const fileRoutes = require('./routes/file.routes');
const subscriptionRoutes = require('./routes/subscription.routes');
const adminRoutes = require('./routes/admin.routes');
const paymentRoutes = require('./routes/payment.routes');

dotenv.config();

const app = express();
const PORT = config.port;

// Security middleware
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false,
}));

// CORS configuration
app.use(cors({
  origin: [config.frontendUrl, 'http://localhost:3000', 'http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.maxRequests,
  message: {
    success: false,
    message: 'تم تجاوز عدد الطلبات المسموح بها. يرجى المحاولة لاحقاً.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', limiter);

// Body parsing with size limits
app.use(express.json({ limit: config.upload.maxFileSize }));
app.use(express.urlencoded({ extended: true, limit: config.upload.maxFileSize }));

// Compression
app.use(compression());

// Logging
if (config.nodeEnv === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Static files for uploads
app.use('/uploads', express.static(path.join(__dirname, config.upload.storagePath)));

// MongoDB Connection
mongoose.connect(config.mongodb.uri, config.mongodb.options)
  .then(() => console.log('✅ MongoDB Connected Successfully'))
  .catch(err => {
    console.error('❌ MongoDB Connection Error:', err);
    process.exit(1);
  });

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/files', fileRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/payments', paymentRoutes);

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'طبيب العجائب API is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    environment: config.nodeEnv,
    developer: config.developer,
    aiProvidersEnabled: Object.entries(config.aiProviders).filter(([_, conf]) => conf.enabled).length,
    paymentGatewaysEnabled: Object.entries(config.payment).filter(([_, conf]) => conf.enabled).length,
  });
});

// API Documentation endpoint
app.get('/api', (req, res) => {
  res.json({
    name: 'طبيب العجائب API',
    version: '1.0.0',
    description: 'منصة الذكاء الاصطناعي الطبية المتكاملة',
    developer: config.developer,
    endpoints: {
      health: 'GET /api/health',
      auth: '/api/auth/*',
      users: '/api/users/*',
      chat: '/api/chat/*',
      files: '/api/files/*',
      subscriptions: '/api/subscriptions/*',
      payments: '/api/payments/*',
      admin: '/api/admin/*',
    },
    features: {
      aiProviders: Object.entries(config.aiProviders).filter(([_, conf]) => conf.enabled).map(([name]) => name),
      paymentGateways: Object.entries(config.payment).filter(([_, conf]) => conf.enabled).map(([name]) => name),
    },
  });
});

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  
  // Handle specific error types
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      message: 'خطأ في التحقق من البيانات',
      errors: err.errors,
    });
  }
  
  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({
      success: false,
      message: 'غير مصرح لك بالوصول',
    });
  }
  
  if (err.code === 11000) {
    return res.status(409).json({
      success: false,
      message: 'البيانات موجودة مسبقاً',
      field: Object.keys(err.keyValue)[0],
    });
  }
  
  // Default error response
  res.status(500).json({
    success: false,
    message: err.message || 'حدث خطأ غير متوقع',
    error: config.nodeEnv === 'development' ? err.stack : undefined,
  });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'الصفحة غير موجودة',
    path: req.path,
  });
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  mongoose.connection.close(() => {
    console.log('MongoDB connection closed');
    process.exit(0);
  });
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

app.listen(PORT, () => {
  console.log(`🚀 طبيب العجائب Server running on port ${PORT}`);
  console.log(`📍 Environment: ${config.nodeEnv}`);
  console.log(`🔗 Frontend URL: ${config.frontendUrl}`);
  console.log(`🤖 AI Providers Enabled: ${Object.entries(config.aiProviders).filter(([_, conf]) => conf.enabled).length}`);
  console.log(`💳 Payment Gateways Enabled: ${Object.entries(config.payment).filter(([_, conf]) => conf.enabled).length}`);
  console.log(`👨‍💻 Developer: ${config.developer.name}`);
  console.log(`📧 Contact: ${config.developer.email}`);
  console.log(`📱 Phone: ${config.developer.phone}`);
});

module.exports = app;
