const express = require('express');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const Payment = require('../models/Payment');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
};

// Register
router.post('/register', [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  body('role').isIn(['driver', 'employer']),
  body('transactionId').optional()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password, role, profile, transactionId } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Check payment for driver registration
    if (role === 'driver') {
      if (!transactionId) {
        return res.status(400).json({
          message: 'Payment required for driver registration',
          requiresPayment: true,
          amount: 499,
          currency: 'KES'
        });
      }

      const payment = await Payment.findOne({
        transactionId,
        status: 'completed',
        paymentType: 'registration_fee'
      });

      if (!payment) {
        return res.status(400).json({
          message: 'Invalid or incomplete payment. Please complete payment first.',
          requiresPayment: true,
          amount: 499,
          currency: 'KES'
        });
      }

      // Check if payment is already used
      const existingUserWithPayment = await User.findOne({
        'paymentDetails.transactionId': transactionId
      });

      if (existingUserWithPayment) {
        return res.status(400).json({
          message: 'Payment already used for another registration'
        });
      }
    }

    const user = new User({
      email,
      password,
      role,
      profile,
      paymentStatus: role === 'driver' ? 'paid' : 'pending',
      paymentDetails: role === 'driver' ? {
        transactionId,
        paidAt: new Date(),
        amount: 499,
        currency: 'KES'
      } : undefined
    });

    await user.save();

    // Update payment with user ID if it's a driver registration
    if (role === 'driver' && transactionId) {
      await Payment.findOneAndUpdate(
        { transactionId },
        { userId: user._id }
      );
    }

    const token = generateToken(user._id);

    res.status(201).json({
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        profile: user.profile,
        paymentStatus: user.paymentStatus
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Login
router.post('/login', [
  body('email').isEmail().normalizeEmail(),
  body('password').exists()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    user.lastLogin = new Date();
    await user.save();

    const token = generateToken(user._id);

    res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        profile: user.profile,
        driverProfile: user.driverProfile,
        employerProfile: user.employerProfile
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get current user
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;