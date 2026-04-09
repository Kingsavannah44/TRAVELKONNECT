const express = require('express');
const Application = require('../models/Application');
const Job = require('../models/Job');
const User = require('../models/User');
const { auth, authorize } = require('../middleware/auth');
const { requirePayment } = require('../middleware/payment');

const router = express.Router();

// Apply for job (driver only)
router.post('/', auth, authorize('driver'), requirePayment, async (req, res) => {
  try {
    const { jobId, coverLetter, documents } = req.body;

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    const existingApplication = await Application.findOne({
      job: jobId,
      driver: req.user.id
    });

    if (existingApplication) {
      return res.status(400).json({ message: 'You have already applied for this job' });
    }

    const application = new Application({
      job: jobId,
      driver: req.user.id,
      employer: job.employer,
      coverLetter,
      documents,
      timeline: [{
        status: 'pending',
        note: 'Application submitted'
      }]
    });

    await application.save();

    // Update job applications count
    await Job.findByIdAndUpdate(jobId, { $inc: { applicationsCount: 1 } });

    // Notify employer
    await User.findByIdAndUpdate(job.employer, {
      $push: {
        notifications: {
          title: 'New Application',
          message: `New application received for ${job.title}`,
          type: 'application'
        }
      }
    });

    res.status(201).json(application);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get driver's applications
router.get('/my-applications', auth, authorize('driver'), async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const query = { driver: req.user.id };
    
    if (status) query.status = status;

    const applications = await Application.find(query)
      .populate('job', 'title company location salary')
      .populate('employer', 'profile.firstName profile.lastName employerProfile.companyName')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await Application.countDocuments(query);

    res.json({
      applications,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get employer's job applications
router.get('/employer/applications', auth, authorize('employer'), async (req, res) => {
  try {
    const { page = 1, limit = 10, jobId, status } = req.query;
    const query = { employer: req.user.id };
    
    if (jobId) query.job = jobId;
    if (status) query.status = status;

    const applications = await Application.find(query)
      .populate('job', 'title')
      .populate('driver', 'profile driverProfile')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await Application.countDocuments(query);

    res.json({
      applications,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update application status (employer only)
router.put('/:id/status', auth, authorize('employer'), async (req, res) => {
  try {
    const { status, notes, interview } = req.body;
    
    const application = await Application.findOne({
      _id: req.params.id,
      employer: req.user.id
    });

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    application.status = status;
    
    if (interview) {
      application.interview = interview;
    }

    application.timeline.push({
      status,
      note: notes || `Status updated to ${status}`
    });

    await application.save();

    // Notify driver
    await User.findByIdAndUpdate(application.driver, {
      $push: {
        notifications: {
          title: 'Application Update',
          message: `Your application status has been updated to: ${status}`,
          type: 'application'
        }
      }
    });

    res.json(application);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single application
router.get('/:id', auth, async (req, res) => {
  try {
    const application = await Application.findById(req.params.id)
      .populate('job')
      .populate('driver', 'profile driverProfile')
      .populate('employer', 'profile employerProfile');

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    // Check authorization
    if (req.user.role === 'driver' && application.driver._id.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    if (req.user.role === 'employer' && application.employer._id.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    res.json(application);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;