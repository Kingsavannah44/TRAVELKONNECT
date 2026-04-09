const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: true,
    default: 499 // Ksh 499
  },
  currency: {
    type: String,
    default: 'KES'
  },
  phoneNumber: {
    type: String,
    required: true
  },
  transactionId: {
    type: String,
    unique: true,
    sparse: true
  },
  mpesaTransactionId: String,
  mpesaReceiptNumber: String,
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed', 'cancelled'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    default: 'mpesa'
  },
  paymentType: {
    type: String,
    enum: ['registration_fee', 'premium_service'],
    default: 'registration_fee'
  },
  mpesaResponse: {
    type: mongoose.Schema.Types.Mixed
  },
  errorMessage: String,
  processedAt: Date,
  expiresAt: {
    type: Date,
    default: () => new Date(Date.now() + 10 * 60 * 1000) // 10 minutes expiry
  }
}, {
  timestamps: true
});

// Index for efficient queries
paymentSchema.index({ userId: 1, status: 1 });
paymentSchema.index({ transactionId: 1 });
paymentSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Pre-save middleware to generate transaction ID
paymentSchema.pre('save', function(next) {
  if (!this.transactionId) {
    this.transactionId = `TXN_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
  next();
});

module.exports = mongoose.model('Payment', paymentSchema);