import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  Phone,
  Truck,
  Building,
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  CreditCard,
  Smartphone
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('pending');
  const [transactionId, setTransactionId] = useState('');
  const [paymentLoading, setPaymentLoading] = useState(false);
  
  const { t } = useTranslation();
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  
  const { register, handleSubmit, formState: { errors }, watch, trigger } = useForm();
  const password = watch('password');

  const steps = selectedRole === 'driver' ? [
    { number: 1, title: 'Choose Role', description: 'Select your account type' },
    { number: 2, title: 'Basic Info', description: 'Personal information' },
    { number: 3, title: 'Payment', description: 'Registration fee payment' },
    { number: 4, title: 'Account Setup', description: 'Create your account' }
  ] : [
    { number: 1, title: 'Choose Role', description: 'Select your account type' },
    { number: 2, title: 'Basic Info', description: 'Personal information' },
    { number: 3, title: 'Account Setup', description: 'Create your account' }
  ];

  const nextStep = async () => {
    let fieldsToValidate = [];

    if (currentStep === 1) {
      if (!selectedRole) {
        toast.error('Please select your role');
        return;
      }
    } else if (currentStep === 2) {
      fieldsToValidate = ['firstName', 'lastName', 'phone'];
    } else if (currentStep === 3 && selectedRole === 'driver') {
      if (paymentStatus !== 'completed') {
        toast.error('Please complete the payment to continue');
        return;
      }
    }

    if (fieldsToValidate.length > 0) {
      const isValid = await trigger(fieldsToValidate);
      if (!isValid) return;
    }

    const maxStep = selectedRole === 'driver' ? 4 : 3;
    setCurrentStep(prev => Math.min(prev + 1, maxStep));
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const initiatePayment = async (phoneNumber) => {
    setPaymentLoading(true);
    try {
      const response = await fetch('/api/payments/initiate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phoneNumber }),
        credentials: 'include'
      });

      const data = await response.json();

      if (response.ok) {
        setTransactionId(data.payment.transactionId);
        toast.success('Payment request sent to your phone. Please check your M-Pesa and enter PIN to complete payment.');

        // Start polling for payment status
        pollPaymentStatus(data.payment.transactionId);
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

  const pollPaymentStatus = async (txnId) => {
    const pollInterval = setInterval(async () => {
      try {
        const response = await fetch(`/api/payments/status/${txnId}`, {
          credentials: 'include'
        });

        const data = await response.json();

        if (response.ok) {
          if (data.payment.status === 'completed') {
            setPaymentStatus('completed');
            toast.success('Payment completed successfully!');
            clearInterval(pollInterval);
          } else if (data.payment.status === 'failed') {
            setPaymentStatus('failed');
            toast.error('Payment failed. Please try again.');
            clearInterval(pollInterval);
          }
        }
      } catch (error) {
        console.error('Error checking payment status:', error);
      }
    }, 5000); // Check every 5 seconds

    // Stop polling after 5 minutes
    setTimeout(() => {
      clearInterval(pollInterval);
      if (paymentStatus !== 'completed') {
        setPaymentStatus('expired');
        toast.error('Payment timeout. Please try again.');
      }
    }, 5 * 60 * 1000);
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const userData = {
        email: data.email,
        password: data.password,
        role: selectedRole,
        profile: {
          firstName: data.firstName,
          lastName: data.lastName,
          phone: data.phone,
          country: 'Kenya'
        },
        ...(selectedRole === 'driver' && {
          paymentStatus: 'paid',
          paymentDetails: {
            transactionId,
            paidAt: new Date().toISOString(),
            amount: 499,
            currency: 'KES'
          }
        })
      };

      const result = await registerUser(userData);
      if (result.success) {
        toast.success(t('auth.registerSuccess'));
        navigate('/dashboard');
      } else {
        if (result.message.includes('Payment required')) {
          setCurrentStep(3);
          toast.error('Please complete payment first');
        } else {
          toast.error(result.message);
        }
      }
    } catch (error) {
      toast.error('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const roleOptions = [
    {
      value: 'driver',
      title: t('auth.driver'),
      description: 'Looking for truck driving opportunities',
      icon: Truck,
      color: 'from-blue-500 to-blue-600'
    },
    {
      value: 'employer',
      title: t('auth.employer'),
      description: 'Hiring truck drivers',
      icon: Building,
      color: 'from-green-500 to-green-600'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-gray-800 flex items-center justify-center py-12 px-4 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-indigo-600/20 to-purple-800/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-blue-600/20 to-indigo-800/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-gradient-to-br from-purple-600/10 to-pink-800/10 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-2xl w-full space-y-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="flex justify-center mb-6"
          >
            <div className="relative">
              <div className="p-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl shadow-xl shadow-indigo-500/25">
                <Truck className="h-10 w-10 text-white" />
              </div>
              <div className="absolute -inset-1 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl blur opacity-25"></div>
            </div>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-4xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent"
          >
            Join TruckConnect
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-3 text-slate-600 text-lg"
          >
            Create your account and start your journey
          </motion.p>
        </motion.div>

        {/* Progress Steps */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex justify-center mb-8"
        >
          <div className="flex items-center space-x-6 bg-gray-800/60 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-gray-700/30">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center">
                <motion.div
                  initial={{ scale: 0.8 }}
                  animate={{ scale: currentStep >= step.number ? 1 : 0.8 }}
                  transition={{ duration: 0.3 }}
                  className={`flex items-center justify-center w-12 h-12 rounded-2xl border-2 transition-all duration-300 ${
                    currentStep >= step.number
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 border-indigo-600 text-white shadow-lg shadow-indigo-500/25'
                      : 'border-gray-600 text-gray-400 bg-gray-700'
                  }`}
                >
                  {currentStep > step.number ? (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      <CheckCircle className="h-6 w-6" />
                    </motion.div>
                  ) : (
                    <span className="font-bold">{step.number}</span>
                  )}
                </motion.div>
                {index < steps.length - 1 && (
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: currentStep > step.number ? 40 : 24 }}
                    transition={{ duration: 0.3 }}
                    className={`h-1 mx-3 rounded-full transition-all duration-300 ${
                      currentStep > step.number
                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600'
                        : 'bg-gray-600'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="bg-gray-800/90 backdrop-blur-xl rounded-3xl p-8 shadow-2xl shadow-indigo-500/20 border border-gray-700/50"
        >
          <form onSubmit={handleSubmit(onSubmit)}>
            <AnimatePresence mode="wait">
              {/* Step 1: Role Selection */}
              {currentStep === 1 && (
                <motion.div
                  key="account-setup"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div className="text-center">
                    <h3 className="text-2xl font-bold text-white mb-3">Choose Your Role</h3>
                    <p className="text-gray-300">Select how you want to use TruckConnect</p>
                  </div>

                  <div className="grid gap-6">
                    {roleOptions.map((option, index) => {
                      const Icon = option.icon;
                      return (
                        <motion.button
                          key={option.value}
                          type="button"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.1 * index }}
                          whileHover={{ scale: 1.02, y: -2 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setSelectedRole(option.value)}
                          className={`group relative p-8 rounded-2xl border-2 transition-all duration-300 text-left overflow-hidden ${
                            selectedRole === option.value
                              ? 'border-indigo-500 bg-gradient-to-br from-indigo-900/50 to-purple-900/50 shadow-xl shadow-indigo-500/20'
                              : 'border-gray-600 hover:border-indigo-400 bg-gray-800/50 hover:shadow-lg hover:bg-gray-700/50'
                          }`}
                        >
                          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/0 via-transparent to-purple-500/0 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                          <div className="relative flex items-center space-x-6">
                            <motion.div
                              whileHover={{ rotate: 5, scale: 1.1 }}
                              className={`p-4 rounded-2xl bg-gradient-to-r ${option.color} shadow-lg group-hover:shadow-xl transition-all duration-300`}
                            >
                              <Icon className="h-8 w-8 text-white" />
                            </motion.div>
                            <div className="flex-1">
                              <h4 className="font-bold text-xl text-white mb-1">{option.title}</h4>
                              <p className="text-gray-300 leading-relaxed">{option.description}</p>
                            </div>
                            {selectedRole === option.value && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="flex items-center justify-center w-8 h-8 bg-indigo-500 rounded-full"
                              >
                                <CheckCircle className="h-5 w-5 text-white" />
                              </motion.div>
                            )}
                          </div>
                        </motion.button>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              {/* Step 2: Personal Information */}
              {currentStep === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div className="text-center">
                    <h3 className="text-xl font-semibold mb-2">Personal Information</h3>
                    <p className="text-gray-600">Tell us about yourself</p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-200 mb-3">
                        First Name
                      </label>
                      <div className="relative group">
                        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-400 transition-colors">
                          <User className="h-5 w-5" />
                        </div>
                        <input
                          {...register('firstName', { required: 'First name is required' })}
                          type="text"
                          className="w-full pl-12 pr-4 py-4 bg-gray-700/50 border border-gray-600 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 transition-all duration-300 text-white placeholder-gray-400 hover:bg-gray-700/70"
                          placeholder="Enter your first name"
                        />
                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-indigo-500/0 via-transparent to-purple-500/0 opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none"></div>
                      </div>
                      {errors.firstName && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mt-2 text-sm text-red-600 flex items-center"
                        >
                          <span className="w-1 h-1 bg-red-600 rounded-full mr-2"></span>
                          {errors.firstName.message}
                        </motion.p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-200 mb-3">
                        Last Name
                      </label>
                      <div className="relative group">
                        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-400 transition-colors">
                          <User className="h-5 w-5" />
                        </div>
                        <input
                          {...register('lastName', { required: 'Last name is required' })}
                          type="text"
                          className="w-full pl-12 pr-4 py-4 bg-gray-700/50 border border-gray-600 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 transition-all duration-300 text-white placeholder-gray-400 hover:bg-gray-700/70"
                          placeholder="Enter your last name"
                        />
                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-indigo-500/0 via-transparent to-purple-500/0 opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none"></div>
                      </div>
                      {errors.lastName && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mt-2 text-sm text-red-600 flex items-center"
                        >
                          <span className="w-1 h-1 bg-red-600 rounded-full mr-2"></span>
                          {errors.lastName.message}
                        </motion.p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-200 mb-3">
                      Phone Number
                    </label>
                    <div className="relative group">
                      <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-400 transition-colors">
                        <Phone className="h-5 w-5" />
                      </div>
                      <input
                        {...register('phone', { required: 'Phone number is required' })}
                        type="tel"
                        className="w-full pl-12 pr-4 py-4 bg-gray-700/50 border border-gray-600 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 transition-all duration-300 text-white placeholder-gray-400 hover:bg-gray-700/70"
                        placeholder="Enter your phone number"
                      />
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-indigo-500/0 via-transparent to-purple-500/0 opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none"></div>
                    </div>
                    {errors.phone && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-2 text-sm text-red-600 flex items-center"
                      >
                        <span className="w-1 h-1 bg-red-600 rounded-full mr-2"></span>
                        {errors.phone.message}
                      </motion.p>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Step 3: Payment (Drivers Only) */}
              {currentStep === 3 && selectedRole === 'driver' && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div className="text-center">
                    <h3 className="text-xl font-semibold mb-2">Registration Fee Payment</h3>
                    <p className="text-slate-600">Pay Ksh 499 to complete your driver registration</p>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h4 className="font-semibold text-lg">Registration Fee</h4>
                        <p className="text-slate-600">One-time payment for driver account</p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-blue-600">Ksh 499</div>
                        <div className="text-sm text-slate-500">One-time fee</div>
                      </div>
                    </div>

                    {paymentStatus === 'pending' && (
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="button"
                        onClick={() => initiatePayment(watch('phone'))}
                        disabled={paymentLoading || !watch('phone')}
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

                    {paymentStatus === 'processing' && (
                      <div className="text-center py-4">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                        <p className="text-blue-600 font-medium">Payment Processing...</p>
                        <p className="text-sm text-slate-600 mt-1">Check your phone for M-Pesa prompt</p>
                      </div>
                    )}

                    {paymentStatus === 'completed' && (
                      <div className="text-center py-4">
                        <div className="p-3 bg-green-100 rounded-full w-16 h-16 mx-auto mb-3 flex items-center justify-center">
                          <CheckCircle className="h-8 w-8 text-green-600" />
                        </div>
                        <p className="text-green-600 font-semibold">Payment Completed!</p>
                        <p className="text-sm text-slate-600 mt-1">You can now proceed to account setup</p>
                      </div>
                    )}

                    {paymentStatus === 'failed' && (
                      <div className="text-center py-4">
                        <div className="p-3 bg-red-100 rounded-full w-16 h-16 mx-auto mb-3 flex items-center justify-center">
                          <CreditCard className="h-8 w-8 text-red-600" />
                        </div>
                        <p className="text-red-600 font-semibold">Payment Failed</p>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          type="button"
                          onClick={() => initiatePayment(watch('phone'))}
                          className="mt-3 btn-secondary"
                        >
                          Try Again
                        </motion.button>
                      </div>
                    )}

                    {paymentStatus === 'expired' && (
                      <div className="text-center py-4">
                        <div className="p-3 bg-yellow-100 rounded-full w-16 h-16 mx-auto mb-3 flex items-center justify-center">
                          <CreditCard className="h-8 w-8 text-yellow-600" />
                        </div>
                        <p className="text-yellow-600 font-semibold">Payment Timeout</p>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          type="button"
                          onClick={() => initiatePayment(watch('phone'))}
                          className="mt-3 btn-secondary"
                        >
                          Retry Payment
                        </motion.button>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Step 3/4: Account Setup */}
              {((currentStep === 3 && selectedRole !== 'driver') || (currentStep === 4 && selectedRole === 'driver')) && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div className="text-center">
                    <h3 className="text-2xl font-bold text-white mb-3">Account Setup</h3>
                    <p className="text-gray-300">Create your login credentials</p>
                  </div>

                   <motion.div
                     initial={{ opacity: 0, x: -20 }}
                     animate={{ opacity: 1, x: 0 }}
                     transition={{ delay: 0.1 }}
                   >
                     <label className="block text-sm font-semibold text-gray-200 mb-3">
                       Email Address
                     </label>
                     <div className="relative group">
                       <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-400 transition-colors">
                         <Mail className="h-5 w-5" />
                       </div>
                       <input
                         {...register('email', {
                           required: 'Email is required',
                           pattern: {
                             value: /^\S+@\S+$/i,
                             message: 'Invalid email address'
                           }
                         })}
                         type="email"
                         className="w-full pl-12 pr-4 py-4 bg-gray-700/50 border border-gray-600 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 transition-all duration-300 text-white placeholder-gray-400 hover:bg-gray-700/70"
                         placeholder="Enter your email address"
                       />
                       <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-indigo-500/0 via-transparent to-purple-500/0 opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none"></div>
                     </div>
                     {errors.email && (
                       <motion.p
                         initial={{ opacity: 0, y: -10 }}
                         animate={{ opacity: 1, y: 0 }}
                         className="mt-2 text-sm text-red-600 flex items-center"
                       >
                         <span className="w-1 h-1 bg-red-600 rounded-full mr-2"></span>
                         {errors.email.message}
                       </motion.p>
                     )}
                   </motion.div>

                   <motion.div
                     initial={{ opacity: 0, x: -20 }}
                     animate={{ opacity: 1, x: 0 }}
                     transition={{ delay: 0.2 }}
                   >
                     <label className="block text-sm font-semibold text-gray-200 mb-3">
                       Password
                     </label>
                     <div className="relative group">
                       <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-400 transition-colors">
                         <Lock className="h-5 w-5" />
                       </div>
                       <input
                         {...register('password', {
                           required: 'Password is required',
                           minLength: {
                             value: 6,
                             message: 'Password must be at least 6 characters'
                           }
                         })}
                         type={showPassword ? 'text' : 'password'}
                         className="w-full pl-12 pr-12 py-4 bg-gray-700/50 border border-gray-600 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 transition-all duration-300 text-white placeholder-gray-400 hover:bg-gray-700/70"
                         placeholder="Create a strong password"
                       />
                       <button
                         type="button"
                         onClick={() => setShowPassword(!showPassword)}
                         className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-indigo-400 transition-colors p-1 rounded-lg hover:bg-gray-600/50"
                       >
                         {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                       </button>
                       <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-indigo-500/0 via-transparent to-purple-500/0 opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none"></div>
                     </div>
                     {errors.password && (
                       <motion.p
                         initial={{ opacity: 0, y: -10 }}
                         animate={{ opacity: 1, y: 0 }}
                         className="mt-2 text-sm text-red-600 flex items-center"
                       >
                         <span className="w-1 h-1 bg-red-600 rounded-full mr-2"></span>
                         {errors.password.message}
                       </motion.p>
                     )}
                   </motion.div>

                   <motion.div
                     initial={{ opacity: 0, x: -20 }}
                     animate={{ opacity: 1, x: 0 }}
                     transition={{ delay: 0.3 }}
                   >
                     <label className="block text-sm font-semibold text-gray-200 mb-3">
                       Confirm Password
                     </label>
                     <div className="relative group">
                       <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-400 transition-colors">
                         <Lock className="h-5 w-5" />
                       </div>
                       <input
                         {...register('confirmPassword', {
                           required: 'Please confirm your password',
                           validate: value => value === password || 'Passwords do not match'
                         })}
                         type={showConfirmPassword ? 'text' : 'password'}
                         className="w-full pl-12 pr-12 py-4 bg-gray-700/50 border border-gray-600 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 transition-all duration-300 text-white placeholder-gray-400 hover:bg-gray-700/70"
                         placeholder="Confirm your password"
                       />
                       <button
                         type="button"
                         onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                         className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-indigo-400 transition-colors p-1 rounded-lg hover:bg-gray-600/50"
                       >
                         {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                       </button>
                       <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-indigo-500/0 via-transparent to-purple-500/0 opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none"></div>
                     </div>
                     {errors.confirmPassword && (
                       <motion.p
                         initial={{ opacity: 0, y: -10 }}
                         animate={{ opacity: 1, y: 0 }}
                         className="mt-2 text-sm text-red-600 flex items-center"
                       >
                         <span className="w-1 h-1 bg-red-600 rounded-full mr-2"></span>
                         {errors.confirmPassword.message}
                       </motion.p>
                     )}
                   </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={prevStep}
                  className="btn-secondary flex items-center"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Previous
                </button>
              )}

              <div className="ml-auto flex space-x-4">
                {currentStep > 1 && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={prevStep}
                    className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-gray-200 rounded-xl font-medium transition-all duration-200 flex items-center"
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back
                  </motion.button>
                )}

                {currentStep < (selectedRole === 'driver' ? 4 : 3) ? (
                  <motion.button
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={nextStep}
                    className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all duration-300 flex items-center hover:shadow-xl"
                  >
                    Next
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </motion.button>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={loading}
                    className="px-8 py-3 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white rounded-xl font-semibold text-lg shadow-xl shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed flex items-center hover:shadow-2xl"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-3"></div>
                        <span>Creating Account...</span>
                      </>
                    ) : (
                      <>
                        <span>Create Account</span>
                        <CheckCircle className="h-5 w-5 ml-2" />
                      </>
                    )}
                  </motion.button>
                )}
              </div>
            </div>
          </form>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.0 }}
            className="mt-8 text-center pt-6 border-t border-gray-700/50"
          >
            <p className="text-gray-400">
              Already have an account?{' '}
              <Link
                to="/login"
                className="font-semibold text-indigo-400 hover:text-indigo-300 transition-colors hover:underline"
              >
                Sign in here
              </Link>
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;