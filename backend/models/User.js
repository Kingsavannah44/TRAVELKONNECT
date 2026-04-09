const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  role: {
    type: String,
    enum: ['driver', 'employer', 'admin'],
    required: true
  },
  profile: {
    firstName: String,
    lastName: String,
    phone: String,
    country: String,
    city: String,
    avatar: String
  },
  driverProfile: {
    licenseNumber: String,
    licenseExpiry: Date,
    yearsExperience: Number,
    truckTypes: [String],
    documents: {
      license: String,
      nationalId: String,
      medicalCert: String,
      passport: String
    },
    verificationStatus: {
      type: String,
      enum: ['pending', 'verified', 'rejected'],
      default: 'pending'
    }
  },
  employerProfile: {
    companyName: String,
    companySize: String,
    industry: String,
    website: String,
    description: String,
    verificationStatus: {
      type: String,
      enum: ['pending', 'verified', 'rejected'],
      default: 'pending'
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'expired'],
    default: 'pending'
  },
  paymentDetails: {
    transactionId: String,
    paidAt: Date,
    amount: Number,
    currency: { type: String, default: 'KES' }
  },
  lastLogin: Date,
  notifications: [{
    title: String,
    message: String,
    type: String,
    read: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
  }]
}, {
  timestamps: true
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);