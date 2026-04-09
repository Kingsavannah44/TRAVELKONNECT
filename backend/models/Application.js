const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true
  },
  driver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  employer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'reviewing', 'shortlisted', 'interview-scheduled', 'rejected', 'hired'],
    default: 'pending'
  },
  coverLetter: String,
  documents: {
    resume: String,
    additionalDocs: [String]
  },
  interview: {
    scheduledDate: Date,
    type: { type: String, enum: ['video', 'phone', 'in-person'] },
    link: String,
    notes: String
  },
  feedback: {
    rating: Number,
    comments: String,
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    reviewedAt: Date
  },
  timeline: [{
    status: String,
    date: { type: Date, default: Date.now },
    note: String
  }]
}, {
  timestamps: true
});

// Prevent duplicate applications
applicationSchema.index({ job: 1, driver: 1 }, { unique: true });

module.exports = mongoose.model('Application', applicationSchema);