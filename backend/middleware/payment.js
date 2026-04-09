const Payment = require('../models/Payment');

// Middleware to check if user has paid registration fee (for drivers)
const requirePayment = async (req, res, next) => {
  try {
    if (req.user.role !== 'driver') {
      return next();
    }

    if (req.user.paymentStatus === 'paid') {
      return next();
    }

    // Check if there's a completed payment
    const payment = await Payment.findOne({
      userId: req.user.id,
      status: 'completed',
      paymentType: 'registration_fee'
    });

    if (payment) {
      // Update user payment status
      await req.user.constructor.findByIdAndUpdate(req.user.id, {
        paymentStatus: 'paid',
        paymentDetails: {
          transactionId: payment.transactionId,
          paidAt: payment.processedAt,
          amount: payment.amount,
          currency: payment.currency
        }
      });
      return next();
    }

    return res.status(403).json({
      message: 'Registration fee payment required to apply for jobs',
      requiresPayment: true,
      amount: 499,
      currency: 'KES',
      redirectTo: '/payment'
    });

  } catch (error) {
    console.error('Error in payment middleware:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { requirePayment };