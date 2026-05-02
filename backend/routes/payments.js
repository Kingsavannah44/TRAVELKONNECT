const express = require('express');
const axios = require('axios');
const https = require('https');
const crypto = require('crypto');
const Payment = require('../models/Payment');
const User = require('../models/User');
const { auth } = require('../middleware/auth');
const { body, validationResult } = require('express-validator');

const router = express.Router();

// M-Pesa configuration
const MPESA_CONFIG = {
  shortcode: process.env.MPESA_SHORTCODE || '600997',
  passkey: process.env.MPESA_PASSKEY,
  consumerKey: process.env.MPESA_CONSUMER_KEY,
  consumerSecret: process.env.MPESA_CONSUMER_SECRET,
  baseUrl: process.env.MPESA_ENVIRONMENT === 'production'
    ? 'https://api.safaricom.co.ke'
    : 'https://sandbox.safaricom.co.ke'
};

// Generate M-Pesa access token
const getMpesaAccessToken = async () => {
  try {
    console.log('Getting M-Pesa access token with key:', MPESA_CONFIG.consumerKey ? 'present' : 'missing');
    const auth = Buffer.from(`${MPESA_CONFIG.consumerKey}:${MPESA_CONFIG.consumerSecret}`).toString('base64');

    const response = await axios.get(`${MPESA_CONFIG.baseUrl}/oauth/v1/generate?grant_type=client_credentials`, {
      headers: {
        'Authorization': `Basic ${auth}`
      }
    });

    console.log('Access token response:', response.data);
    return response.data.access_token;
  } catch (error) {
    console.error('Error getting M-Pesa access token:', error.response ? error.response.data : error.message);
    throw new Error('Failed to get M-Pesa access token');
  }
};



// Initiate M-Pesa STK Push
router.post('/initiate', [
  auth,
  body('phoneNumber').isMobilePhone('any', { strictMode: false }).withMessage('Invalid phone number')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { phoneNumber } = req.body;
    const userId = req.user.id;
    const amount = 499; // Ksh 499

    // Check if user already has a completed payment
    const payments = await Payment.findByUserId(userId);
    const existingPayment = payments.find(p => p.status === 'completed' && p.paymentType === 'registration_fee');

    if (existingPayment) {
      return res.status(400).json({
        message: 'Registration fee already paid',
        payment: existingPayment
      });
    }

    // Check for pending payment and cancel it
    const pendingPayment = payments.find(p => ['pending', 'processing'].includes(p.status) && p.paymentType === 'registration_fee');

    if (pendingPayment) {
      pendingPayment.status = 'cancelled';
      await pendingPayment.save();
    }

    // Create new payment record
    const payment = await Payment.create({
      userId,
      amount,
      phoneNumber,
      paymentType: 'registration_fee'
    });

    console.log('Initiating payment for phone:', phoneNumber, 'amount:', amount);

    // For testing, skip M-Pesa and mark as completed
    payment.status = 'completed';
    payment.processedAt = new Date();
    payment.mpesaTransactionId = `TEST_${Date.now()}`;
    payment.mpesaReceiptNumber = `TEST_RECEIPT_${payment.transactionId}`;
    // payment.mpesaResponse = response.data;
    await payment.save();

    res.json({
      message: 'Payment initiated successfully',
      payment: {
        id: payment.id,
        transactionId: payment.transactionId,
        amount: payment.amount,
        status: payment.status
      }
    });

  } catch (error) {
    console.error('Error initiating payment:', error);

    // Update payment status if it exists
    const payments = await Payment.findByUserId(req.user.id);
    const processingPayment = payments.find(p => p.status === 'processing');
    if (processingPayment) {
      processingPayment.status = 'failed';
      processingPayment.errorMessage = error.message;
      await processingPayment.save();
    }

    res.status(500).json({
      message: 'Failed to initiate payment',
      error: error.message
    });
  }
});

// M-Pesa C2B callback
router.post('/callback', async (req, res) => {
  try {
    console.log('M-Pesa Callback:', JSON.stringify(req.body, null, 2));

    const callbackData = req.body;
    const { Body } = callbackData;

    if (!Body || !Body.TransID) {
      return res.status(400).json({ message: 'Invalid callback data' });
    }

    // Find payment by BillRefNumber
    const transactionId = Body.BillRefNumber.replace('TruckConnect-', '');
    const payment = await Payment.findByTransactionId(transactionId);

    if (!payment) {
      console.error('Payment not found for transactionId:', transactionId);
      return res.status(404).json({ message: 'Payment not found' });
    }

    // Payment successful (C2B callback is sent on successful payment)
    payment.status = 'completed';
    payment.processedAt = new Date();
    payment.mpesaReceiptNumber = Body.TransID;

    // Update user payment status if user exists
    if (payment.userId) {
      await User.findByIdAndUpdate(payment.userId, {
        paymentStatus: 'paid',
        paymentDetails: {
          transactionId: payment.transactionId,
          paidAt: new Date(),
          amount: payment.amount,
          currency: payment.currency
        }
      });
    }

    payment.mpesaResponse = callbackData;
    await payment.save();

    res.json({ message: 'Callback processed successfully' });

  } catch (error) {
    console.error('Error processing callback:', error);
    res.status(500).json({ message: 'Error processing callback' });
  }
});

// Check payment status
router.get('/status/:transactionId', async (req, res) => {
  try {
    const { transactionId } = req.params;

    const payment = await Payment.findByTransactionId(transactionId);

    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    res.json({
      payment: {
        id: payment.id,
        transactionId: payment.transactionId,
        amount: payment.amount,
        status: payment.status,
        createdAt: payment.created_at,
        processedAt: payment.processedAt,
        errorMessage: payment.errorMessage
      }
    });

  } catch (error) {
    console.error('Error checking payment status:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user payment history
router.get('/history', auth, async (req, res) => {
  try {
    const payments = await Payment.findByUserId(req.user.id);
    payments.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    res.json({ payments });

  } catch (error) {
    console.error('Error fetching payment history:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Register C2B URLs
router.post('/register-c2b', async (req, res) => {
  try {
    console.log('Registering C2B URLs');

    // Get M-Pesa access token
    const accessToken = await getMpesaAccessToken();
    console.log('Access token for register:', accessToken ? 'obtained' : 'failed');

    const registerData = {
      ShortCode: MPESA_CONFIG.shortcode,
      ResponseType: 'Completed',
      ConfirmationURL: `${process.env.BASE_URL || 'http://localhost:5000'}/api/payments/callback`,
      ValidationURL: `${process.env.BASE_URL || 'http://localhost:5000'}/api/payments/callback`
    };

    console.log('Register data:', registerData);

    const data = JSON.stringify(registerData);
    const options = {
      hostname: MPESA_CONFIG.baseUrl.replace(/^https?:\/\//, ''),
      path: '/mpesa/c2b/v2/registerurl',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
        'Content-Length': Buffer.byteLength(data)
      }
    };

    const response = await new Promise((resolve, reject) => {
      const req = https.request(options, res => {
        console.log('Register response status:', res.statusCode);
        let body = '';
        res.on('data', chunk => {
          body += chunk;
        });
        res.on('end', () => {
          console.log('Register response body:', body);
          try {
            const responseData = JSON.parse(body);
            resolve({ data: responseData });
          } catch (e) {
            reject(e);
          }
        });
      });
      req.on('error', (error) => {
        console.log('Register request error:', error);
        reject(error);
      });
      req.write(data);
      req.end();
    });

    console.log('C2B register response:', response.data);
    res.json({ message: 'C2B URLs registered successfully', response: response.data });

  } catch (error) {
    console.error('Error registering C2B URLs:', error);
    res.status(500).json({ message: 'Failed to register C2B URLs', error: error.message });
  }
});

module.exports = router;