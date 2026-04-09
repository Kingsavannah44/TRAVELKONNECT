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
        ...(selectedRole === 'driver' && { transactionId })
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
    <div className="min-h-screen flex items-center justify-center py-12 px-4">
      <div className="max-w-2xl w-full space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full">
              <Truck className="h-8 w-8 text-white" />
            </div>
          </div>
          <h2 className="text-3xl font-bold gradient-text">
            {t('auth.register')}
          </h2>
          <p className="mt-2 text-slate-600">
            Join TruckConnect today
          </p>
        </motion.div>

        {/* Progress Steps */}
        <div className="flex justify-center">
          <div className="flex items-center space-x-4">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300 ${
                  currentStep >= step.number
                    ? 'bg-primary-500 border-primary-500 text-white'
                    : 'border-gray-300 text-gray-400'
                }`}>
                  {currentStep > step.number ? (
                    <CheckCircle className="h-5 w-5" />
                  ) : (
                    step.number
                  )}
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-16 h-0.5 mx-2 transition-all duration-300 ${
                    currentStep > step.number ? 'bg-primary-500' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="glass-card"
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
                    <h3 className="text-xl font-semibold mb-2">Choose Your Role</h3>
                    <p className="text-gray-600">Select how you want to use TruckConnect</p>
                  </div>

                  <div className="grid gap-4">
                    {roleOptions.map((option) => {
                      const Icon = option.icon;
                      return (
                        <motion.button
                          key={option.value}
                          type="button"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setSelectedRole(option.value)}
                          className={`p-6 rounded-xl border-2 transition-all duration-300 text-left ${
                            selectedRole === option.value
                              ? 'border-primary-500 bg-primary-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="flex items-center space-x-4">
                            <div className={`p-3 rounded-lg bg-gradient-to-r ${option.color}`}>
                              <Icon className="h-6 w-6 text-white" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-lg">{option.title}</h4>
                              <p className="text-gray-600">{option.description}</p>
                            </div>
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
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t('auth.firstName')}
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                          {...register('firstName', { required: 'First name is required' })}
                          type="text"
                          className="input-field pl-10"
                          placeholder="Enter first name"
                        />
                      </div>
                      {errors.firstName && (
                        <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t('auth.lastName')}
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                          {...register('lastName', { required: 'Last name is required' })}
                          type="text"
                          className="input-field pl-10"
                          placeholder="Enter last name"
                        />
                      </div>
                      {errors.lastName && (
                        <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('auth.phone')}
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        {...register('phone', { required: 'Phone number is required' })}
                        type="tel"
                        className="input-field pl-10"
                        placeholder="Enter phone number"
                      />
                    </div>
                    {errors.phone && (
                      <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
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
                    <h3 className="text-xl font-semibold mb-2">Account Setup</h3>
                    <p className="text-gray-600">Create your login credentials</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('auth.email')}
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        {...register('email', {
                          required: 'Email is required',
                          pattern: {
                            value: /^\S+@\S+$/i,
                            message: 'Invalid email address'
                          }
                        })}
                        type="email"
                        className="input-field pl-10"
                        placeholder="Enter your email"
                      />
                    </div>
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('auth.password')}
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        {...register('password', {
                          required: 'Password is required',
                          minLength: {
                            value: 6,
                            message: 'Password must be at least 6 characters'
                          }
                        })}
                        type={showPassword ? 'text' : 'password'}
                        className="input-field pl-10 pr-10"
                        placeholder="Create password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('auth.confirmPassword')}
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        {...register('confirmPassword', {
                          required: 'Please confirm your password',
                          validate: value => value === password || 'Passwords do not match'
                        })}
                        type={showConfirmPassword ? 'text' : 'password'}
                        className="input-field pl-10 pr-10"
                        placeholder="Confirm password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
                    )}
                  </div>
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

              <div className="ml-auto">
                {currentStep < (selectedRole === 'driver' ? 4 : 3) ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="btn-primary flex items-center"
                  >
                    Next
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </button>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={loading}
                    className="btn-primary flex items-center"
                  >
                    {loading ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    ) : null}
                    Create Account
                  </motion.button>
                )}
              </div>
            </div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link
                to="/login"
                className="font-medium text-primary-600 hover:text-primary-500"
              >
                {t('auth.login')}
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;