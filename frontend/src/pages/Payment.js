import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import {
  CreditCard,
  Smartphone,
  CheckCircle,
  Clock,
  AlertCircle,
  ArrowLeft
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Payment = () => {
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user?.role === 'driver') {
      fetchPaymentHistory();
    }
  }, [user]);

  const fetchPaymentHistory = async () => {
    try {
      const response = await fetch('/api/payments/history', {
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        setPaymentHistory(data.payments);
      }
    } catch (error) {
      console.error('Error fetching payment history:', error);
    } finally {
      setLoading(false);
    }
  };

  const initiatePayment = async () => {
    if (!user?.profile?.phone) {
      toast.error('Please update your phone number in profile first');
      return;
    }

    setPaymentLoading(true);
    try {
      const response = await fetch('/api/payments/initiate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phoneNumber: user.profile.phone }),
        credentials: 'include'
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Payment request sent to your phone. Please check your M-Pesa and enter PIN to complete payment.');
        fetchPaymentHistory(); // Refresh history
      } else {
        toast.error(data.message || 'Failed to initiate payment');
      }
    } catch (error) {
      console.error('Payment initiation error:', error);
      toast.error('Failed to initiate payment. Please try again.');
    } finally {
      setPaymentLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'processing':
        return <Clock className="h-5 w-5 text-blue-600" />;
      case 'failed':
        return <AlertCircle className="h-5 w-5 text-red-600" />;
      default:
        return <CreditCard className="h-5 w-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-100';
      case 'processing':
        return 'text-blue-600 bg-blue-100';
      case 'failed':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-4">Please log in to access payments</h2>
          <Link to="/login" className="btn-primary">Login</Link>
        </div>
      </div>
    );
  }

  if (user.role !== 'driver') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-4">Payment system is only for drivers</h2>
          <Link to="/dashboard" className="btn-secondary">Go to Dashboard</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/dashboard"
            className="inline-flex items-center text-slate-600 hover:text-blue-600 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold gradient-text mb-2">Registration Fee Payment</h1>
          <p className="text-slate-600">Manage your driver registration payment</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Payment Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card"
          >
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-3 bg-blue-100 rounded-lg">
                <CreditCard className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold">Registration Fee</h3>
                <p className="text-slate-600">One-time payment for driver account</p>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-lg">Amount Due</h4>
                  <p className="text-slate-600">Required for job applications</p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-blue-600">Ksh 499</div>
                  <div className="text-sm text-slate-500">One-time fee</div>
                </div>
              </div>
            </div>

            {user.paymentStatus === 'paid' ? (
              <div className="text-center py-6">
                <div className="p-4 bg-green-100 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                  <CheckCircle className="h-10 w-10 text-green-600" />
                </div>
                <h4 className="text-lg font-semibold text-green-600 mb-2">Payment Completed!</h4>
                <p className="text-slate-600">You can now apply for jobs.</p>
              </div>
            ) : (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={initiatePayment}
                disabled={paymentLoading}
                className="w-full btn-primary flex items-center justify-center disabled:opacity-50"
              >
                {paymentLoading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                ) : (
                  <Smartphone className="h-5 w-5 mr-2" />
                )}
                {paymentLoading ? 'Sending Payment Request...' : 'Pay with M-Pesa'}
              </motion.button>
            )}
          </motion.div>

          {/* Payment History */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card"
          >
            <h3 className="text-xl font-semibold mb-6">Payment History</h3>

            {loading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : paymentHistory.length === 0 ? (
              <div className="text-center py-8">
                <CreditCard className="h-16 w-16 text-slate-400 mx-auto mb-4" />
                <p className="text-slate-600">No payment history found</p>
              </div>
            ) : (
              <div className="space-y-4">
                {paymentHistory.map((payment) => (
                  <div key={payment._id} className="border border-slate-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(payment.status)}
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(payment.status)}`}>
                          {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                        </span>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">Ksh {payment.amount}</div>
                        <div className="text-sm text-slate-500">
                          {new Date(payment.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <div className="text-sm text-slate-600">
                      Transaction ID: {payment.transactionId}
                    </div>
                    {payment.errorMessage && (
                      <div className="text-sm text-red-600 mt-1">
                        {payment.errorMessage}
                      </div>
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