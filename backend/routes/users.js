const express = require('express');
const User = require('../models/User');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

// Update profile
router.put('/profile', auth, async (req, res) => {
  try {
    const updates = req.body;
    const user = await User.findById(req.user.id);

    if (updates.profile) {
      user.profile = { ...user.profile, ...updates.profile };
    }

    if (updates.driverProfile && user.role === 'driver') {
      user.driverProfile = { ...user.driverProfile, ...updates.driverProfile };
    }

    if (updates.employerProfile && user.role === 'employer') {
      user.employerProfile = { ...user.employerProfile, ...updates.employerProfile };
    }

    await user.save();

    res.json({
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        profile: user.profile,
        driverProfile: user.driverProfile,
        employerProfile: user.employerProfile
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get notifications
router.get('/notifications', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('notifications');
    res.json(user.notifications.sort((a, b) => b.createdAt - a.createdAt));
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Mark notification as read
router.put('/notifications/:id/read', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const notification = user.notifications.id(req.params.id);
    
    if (notification) {
      notification.read = true;
      await user.save();
    }

    res.json({ message: 'Notification marked as read' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin: Get all users
router.get('/admin/users', auth, authorize('admin'), async (req, res) => {
  try {
    const { page = 1, limit = 10, role, status } = req.query;
    const query = {};
    
    if (role) query.role = role;
    if (status) query.isActive = status === 'active';

    const users = await User.find(query)
      .select('-password')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await User.countDocuments(query);

    res.json({
      users,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin: Verify user documents
router.put('/admin/verify/:userId', auth, authorize('admin'), async (req, res) => {
  try {
    const { status, notes } = req.body;
    const user = await User.findById(req.params.userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.role === 'driver') {
      user.driverProfile.verificationStatus = status;
    } else if (user.role === 'employer') {
      user.employerProfile.verificationStatus = status;
    }

    // Add notification
    user.notifications.push({
      title: 'Verification Update',
      message: `Your account verification status has been updated to: ${status}`,
      type: 'verification'
    });

    await user.save();

    res.json({ message: 'User verification status updated' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;