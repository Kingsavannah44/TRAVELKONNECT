import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import axios from 'axios';
import {
  CreditCard, Smartphone, CheckCircle, Clock, AlertCircle, ArrowLeft, RefreshCw
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Payment = () => {
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [phoneNumber, setPhoneNumber] = useState('');
  const { user, loadUser } = useAuth();

  useEffect(() => {
    if (user) {
      setPhoneNumber(user?.profile?.phone || '');
      fetchPaymentHistory();
    }
  }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchPaymentHistory = async () => {
    try {
      const res = await axios.get('/api/payments/history');
      setPaymentHistory(res.data.payments);
    } catch (error) {
      console.error('Error fetching payment history:', error);
    } finally {
      setLoading(false);
    }
  };

  const initiatePayment = async () => {
    if (!phoneNumber) {
      toast.error('Please enter your M-Pesa phone number');
      return;
    }

    setPaymentLoading(true);
    try {
      const res = await axios.post('/api/payments/initiate', {
        phoneNumber,
        userId: user._id
      });

      toast.success('Payment request sent! Check your phone and enter M-Pesa PIN.');
      fetchPaymentHistory();

      // Poll for payment status every 5 seconds for 60 seconds
      let attempts = 0;
      const poll = setInterval(async () => {
        attempts++;
        try {
          const statusRes = await axios.get(`/api/payments/status/${res.data.payment.transactionId}`);
          if (statusRes.data.payment.status === 'completed') {
            clearInterval(poll);
            toast.success('Payment completed successfully!');
            loadUser();
            fetchPaymentHistory();
          } else if (statusRes.data.payment.status === 'failed') {
            clearInterval(poll);
            toast.error('Payment failed. Please try again.');
            fetchPaymentHistory();
          }
        } catch (e) {}
        if (attempts >= 12) clearInterval(poll);
      }, 5000);

    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to initiate payment');
    } finally {
      setPaymentLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'processing': return <Clock className="h-5 w-5 text-blue-500" />;
      case 'failed': return <AlertCircle className="h-5 w-5 text-red-500" />;
      default: return <CreditCard className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-green-700 bg-green-100';
      case 'processing': return 'text-blue-700 bg-blue-100';
      case 'failed': return 'text-red-700 bg-red-100';
      default: return 'text-gray-700 bg-gray-100';
    }
  };

  if (!user) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-xl font-semibold mb-4">Please log in to access payments</h2>
        <Link to="/login" className="btn-primary">Login</Link>
      </div>
    </div>
  );

  if (user.role !== 'driver') return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-xl font-semibold mb-4">Payments are only for drivers</h2>
        <Link to="/dashboard" className="btn-secondary">Go to Dashboard</Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen py-8 px-4 bg-gray-950 text-white">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link to="/dashboard" className="inline-flex items-center text-gray-400 hover:text-red-400 mb-4 transition-colors">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Link>
          <h1 className="text-3xl font-extrabold text-white mb-1">Registration Fee Payment</h1>
          <p className="text-gray-400">Pay via M-Pesa to unlock job applications</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Payment Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-900 border border-white/10 rounded-2xl p-6"
          >
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-3 bg-red-600 rounded-xl">
                <Smartphone className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">M-Pesa Payment</h3>
                <p className="text-gray-400 text-sm">Safaricom M-Pesa STK Push</p>
              </div>
            </div>

            <div className="bg-blue-900/30 border border-blue-700/40 rounded-xl p-5 mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-white">Registration Fee</h4>
                  <p className="text-gray-400 text-sm">One-time · Unlocks job applications</p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-extrabold text-red-400">Ksh 499</div>
                  <div className="text-xs text-gray-500">One-time fee</div>
                </div>
              </div>
            </div>

            {user.paymentStatus === 'paid' ? (
              <div className="text-center py-6">
                <div className="p-4 bg-green-900/30 border border-green-700/40 rounded-2xl mb-4 inline-block">
                  <CheckCircle className="h-10 w-10 text-green-400" />
                </div>
                <h4 className="text-lg font-bold text-green-400 mb-1">Payment Completed!</h4>
                <p className="text-gray-400 text-sm">You can now apply for jobs.</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    M-Pesa Phone Number
                  </label>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="e.g. 0712345678 or 254712345678"
                    className="w-full px-4 py-3 bg-gray-800 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={initiatePayment}
                  disabled={paymentLoading}
                  className="w-full flex items-center justify-center space-x-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white py-3.5 rounded-xl font-semibold transition-all"
                >
                  {paymentLoading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                  ) : (
                    <Smartphone className="h-5 w-5" />
                  )}
                  <span>{paymentLoading ? 'Sending Request...' : 'Pay Ksh 499 via M-Pesa'}</span>
                </motion.button>
                <p className="text-xs text-gray-500 text-center">
                  You will receive an M-Pesa prompt on your phone. Enter your PIN to complete payment.
                </p>
              </div>
            )}
          </motion.div>

          {/* Payment History */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gray-900 border border-white/10 rounded-2xl p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-white">Payment History</h3>
              <button onClick={fetchPaymentHistory} className="text-gray-400 hover:text-white transition-colors">
                <RefreshCw className="h-4 w-4" />
              </button>
            </div>

            {loading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500" />
              </div>
            ) : paymentHistory.length === 0 ? (
              <div className="text-center py-8">
                <CreditCard className="h-12 w-12 text-gray-600 mx-auto mb-3" />
                <p className="text-gray-500">No payment history yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {paymentHistory.map((payment) => (
                  <div key={payment._id} className="bg-gray-800 border border-white/5 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(payment.status)}
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(payment.status)}`}>
                          {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                        </span>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-white">Ksh {payment.amount}</div>
                        <div className="text-xs text-gray-500">{new Date(payment.createdAt).toLocaleDateString()}</div>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 truncate">ID: {payment.transactionId}</p>
                    {payment.errorMessage && (
                      <p className="text-xs text-red-400 mt-1">{payment.errorMessage}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
