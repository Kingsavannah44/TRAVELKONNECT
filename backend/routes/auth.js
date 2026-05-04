const express = require("express");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const User = require("../models/User");
const Payment = require("../models/Payment");
const { auth } = require("../middleware/auth");

const router = express.Router();

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// Register
router.post(
  "/register",
  [
    body("email").isEmail().normalizeEmail(),
    body("password").isLength({ min: 6 }),
    body("role").isIn(["driver", "employer"]),
    body("transactionId").optional(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: 'Validation failed', errors: errors.array() });
    }

    try {
      const { email, password, role, profile, transactionId } = req.body;

      const existingUser = await User.findByEmail(email);
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
      }

      const user = await User.create({
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

      // Update payment with user ID if it's a driver registration
      if (role === "driver" && transactionId) {
        const paymentToUpdate = await Payment.findByTransactionId(transactionId);
        if (paymentToUpdate) {
          paymentToUpdate.userId = user.id;
          await paymentToUpdate.save();
        }
      }

      const token = generateToken(user.id);
      res.status(201).json({
        token,
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          profile: user.profile,
          paymentStatus: user.paymentStatus
        }
      });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }
);

// Login
router.post('/login', [
  body('email').isEmail().normalizeEmail(),
  body('password').exists()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: 'Validation failed', errors: errors.array() });
  }

  try {
    const { email, password } = req.body;

    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(user.id);
    res.status(200).json({
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        profile: user.profile,
        paymentStatus: user.paymentStatus
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get current user
router.get("/me", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
