const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  subscriptionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subscription'
  },
  amount: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    default: 'EGP'
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded', 'cancelled'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['credit_card', 'debit_card', 'fawry', 'vodafone_cash', 'etisalat_cash', 'orange_cash', 'we_cash', 'masary', 'bank_transfer', 'cash', 'paypal', 'stripe'],
    required: true
  },
  paymentProvider: {
    type: String,
    enum: ['stripe', 'paypal', 'fawry', 'paymob', 'khazna', 'accept', 'tap', 'myfatoorah', 'manual']
  },
  transactionId: String,
  providerResponse: Object,
  description: String,
  invoiceUrl: String,
  receiptUrl: String,
  refundReason: String,
  refundedAt: Date,
  refundAmount: Number,
  metadata: {
    ipAddress: String,
    userAgent: String,
    platform: String,
    deviceId: String
  },
  billingDetails: {
    name: String,
    email: String,
    phone: String,
    address: String,
    city: String,
    country: {
      type: String,
      default: 'Egypt'
    },
    postalCode: String
  }
}, {
  timestamps: true
});

// Indexes
paymentSchema.index({ userId: 1, createdAt: -1 });
paymentSchema.index({ status: 1 });
paymentSchema.index({ transactionId: 1 });

module.exports = mongoose.model('Payment', paymentSchema);
