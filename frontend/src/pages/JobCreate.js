import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import {
  Plus,
  Building,
  MapPin,
  DollarSign,
  FileText,
  Clock,
  Briefcase,
  Award,
  ArrowLeft,
  ArrowRight,
  CheckCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const JobCreate = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  
  const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm();

  const steps = [
    { number: 1, title: 'Job Details', description: 'Basic information' },
    { number: 2, title: 'Requirements', description: 'Skills and qualifications' },
    { number: 3, title: 'Compensation', description: 'Salary and benefits' },
    { number: 4, title: 'Review', description: 'Confirm and post' }
  ];

  const formData = watch();

  const nextStep = () => {
    if (currentStep === 1) {
      const requiredFields = ['title', 'company', 'country', 'state', 'city', 'description'];
      const isValid = requiredFields.every(field => formData[field]);
      if (!isValid) {
        toast.error('Please fill in all required fields');
        return;
      }
    }
    if (currentStep < 4) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const jobData = {
        title: data.title,
        company: data.company,
        location: {
          country: data.country,
          state: data.state,
          city: data.city,
          address: data.address || ''
        },
        description: data.description,
        requirements: {
          experience: parseInt(data.experience) || 0,
          licenseType: data.licenseType || '',
          truckTypes: data.truckTypes ? data.truckTypes.split(',').map(t => t.trim()) : [],
          languages: data.languages ? data.languages.split(',').map(l => l.trim()) : []
        },
        salary: {
          min: parseFloat(data.salaryMin) || 0,
          max: parseFloat(data.salaryMax) || 0,
          currency: data.currency || 'USD',
          period: data.salaryPeriod || 'yearly'
        },
        benefits: data.benefits ? data.benefits.split(',').map(b => b.trim()) : [],
        job_type: data.jobType || 'full-time',
        application_deadline: data.deadline || null
      };

      const token = localStorage.getItem('token');
      const response = await fetch('/api/jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(jobData)
      });

      if (response.ok) {
        toast.success('Job posted successfully!');
        navigate('/dashboard');
      } else {
        const error = await response.json();
        toast.error(error.message || 'Failed to post job');
      }
    } catch (error) {
      toast.error('Failed to post job. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="space-y-6"
          >
            <h3 className="text-2xl font-bold text-white mb-6">Basic Job Information</h3>
            
            <div>
              <label className="block text-sm font-semibold text-gray-200 mb-3">Job Title *</label>
              <input
                {...register('title', { required: true })}
                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400"
                placeholder="e.g., Long Haul Truck Driver"
              />
              {errors.title && <p className="mt-1 text-sm text-red-400">Job title is required</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-200 mb-3">Company Name *</label>
              <div className="relative">
                <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  {...register('company', { required: true })}
                  className="w-full pl-10 pr-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400"
                  placeholder="Your company name"
                />
              </div>
              {errors.company && <p className="mt-1 text-sm text-red-400">Company name is required</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-200 mb-3">Country *</label>
                <input
                  {...register('country', { required: true })}
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400"
                  placeholder="United States"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-200 mb-3">State *</label>
                <input
                  {...register('state', { required: true })}
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400"
                  placeholder="Texas"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-200 mb-3">City *</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  {...register('city', { required: true })}
                  className="w-full pl-10 pr-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400"
                  placeholder="Dallas"
                />
              </div>
              {errors.city && <p className="mt-1 text-sm text-red-400">City is required</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-200 mb-3">Job Description *</label>
              <textarea
                {...register('description', { required: true })}
                rows={6}
                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 resize-none"
                placeholder="Provide a detailed description of the job..."
              />
              {errors.description && <p className="mt-1 text-sm text-red-400">Description is required</p>}
            </div>
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="space-y-6"
          >
            <h3 className="text-2xl font-bold text-white mb-6">Job Requirements</h3>
            
            <div>
              <label className="block text-sm font-semibold text-gray-200 mb-3">
                Years of Experience Required
              </label>
              <input
                type="number"
                {...register('experience')}
                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400"
                placeholder="e.g., 2"
                min="0"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-200 mb-3">
                Required License Type
              </label>
              <input
                {...register('licenseType')}
                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400"
                placeholder="e.g., CDL Class A"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-200 mb-3">
                Truck Types (comma-separated)
              </label>
              <input
                {...register('truckTypes')}
                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400"
                placeholder="e.g., Semi-trailer, Dry Van, Flatbed"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-200 mb-3">
                Required Languages (comma-separated)
              </label>
              <input
                {...register('languages')}
                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400"
                placeholder="e.g., English, Spanish"
              />
            </div>
          </motion.div>
        );

      case 3:
        return (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="space-y-6"
          >
            <h3 className="text-2xl font-bold text-white mb-6">Compensation & Benefits</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-200 mb-3">Min Salary</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="number"
                    {...register('salaryMin')}
                    className="w-full pl-10 pr-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400"
                    placeholder="60000"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-200 mb-3">Max Salary</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="number"
                    {...register('salaryMax')}
                    className="w-full pl-10 pr-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400"
                    placeholder="85000"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-200 mb-3">Currency</label>
                <select
                  {...register('currency')}
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400"
                >
                  <option value="USD">USD ($)</option>
                  <option value="KES">KES (KSh)</option>
                  <option value="CAD">CAD ($)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-200 mb-3">Pay Period</label>
                <select
                  {...register('salaryPeriod')}
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400"
                >
                  <option value="yearly">Yearly</option>
                  <option value="monthly">Monthly</option>
                  <option value="weekly">Weekly</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-200 mb-3">
                Job Type
              </label>
              <select
                {...register('jobType')}
                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400"
              >
                <option value="full-time">Full-time</option>
                <option value="part-time">Part-time</option>
                <option value="contract">Contract</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-200 mb-3">
                Benefits (comma-separated)
              </label>
              <textarea
                {...register('benefits')}
                rows={3}
                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 resize-none"
                placeholder="e.g., Health Insurance, 401k Matching, Paid Time Off"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-200 mb-3">
                Application Deadline
              </label>
              <input
                type="date"
                {...register('deadline')}
                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400"
              />
            </div>
          </motion.div>
        );

      case 4:
        return (
          <motion.div
            key="step4"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="space-y-6"
          >
            <h3 className="text-2xl font-bold text-white mb-6">Review & Post Job</h3>
            
            <div className="bg-gray-800/50 rounded-xl p-6 space-y-4">
              <div>
                <h4 className="text-lg font-semibold text-white">{formData.title}</h4>
                <p className="text-gray-300">{formData.company}</p>
              </div>

              <div className="flex items-center text-gray-300">
                <MapPin className="h-4 w-4 mr-2" />
                <span>{formData.city}, {formData.state}, {formData.country}</span>
              </div>

              <div>
                <h5 className="font-semibold text-white mb-2">Description</h5>
                <p className="text-gray-300 text-sm">{formData.description}</p>
              </div>

              <div>
                <h5 className="font-semibold text-white mb-2">Requirements</h5>
                <ul className="text-gray-300 text-sm space-y-1">
                  {formData.experience && <li>• {formData.experience}+ years experience</li>}
                  {formData.licenseType && <li>• License: {formData.licenseType}</li>}
                  {formData.truckTypes && <li>• Truck Types: {formData.truckTypes}</li>}
                  {formData.languages && <li>• Languages: {formData.languages}</li>}
                </ul>
              </div>

              <div>
                <h5 className="font-semibold text-white mb-2">Compensation</h5>
                <p className="text-gray-300 text-sm">
                  ${formData.salaryMin || '0'} - ${formData.salaryMax || '0'} {formData.currency} ({formData.salaryPeriod})
                </p>
              </div>

              {formData.benefits && (
                <div>
                  <h5 className="font-semibold text-white mb-2">Benefits</h5>
                  <p className="text-gray-300 text-sm">{formData.benefits}</p>
                </div>
              )}

              <div className="pt-4 border-t border-gray-700">
                <p className="text-sm text-gray-400">
                  By posting this job, you agree to our terms of service and privacy policy.
                </p>
              </div>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-gray-800 py-12 px-4 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-indigo-600/20 to-purple-800/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-blue-600/20 to-indigo-800/20 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center text-gray-400 hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Dashboard
          </button>
          
          <h1 className="text-4xl font-bold text-white mb-2">Post New Job</h1>
          <p className="text-gray-400">Create a job listing to attract qualified drivers</p>
        </motion.div>

        {/* Progress Steps */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-4 bg-gray-800/60 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-gray-700/30">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300 ${
                  currentStep >= step.number
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 border-indigo-600 text-white shadow-lg'
                    : 'border-gray-600 text-gray-400 bg-gray-700'
                }`}>
                  {currentStep > step.number ? (
                    <CheckCircle className="h-5 w-5" />
                  ) : (
                    step.number
                  )}
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-12 h-1 mx-3 rounded-full transition-all duration-300 ${
                    currentStep > step.number
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600'
                      : 'bg-gray-600'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-800/90 backdrop-blur-xl rounded-3xl p-8 shadow-2xl shadow-indigo-500/10 border border-gray-700/50"
        >
          <form onSubmit={handleSubmit(onSubmit)}>
            <AnimatePresence mode="wait">
              {renderStep()}
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8 pt-6 border-t border-gray-700/50">
              <button
                type="button"
                onClick={prevStep}
                disabled={currentStep === 1}
                className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-gray-200 rounded-xl font-medium transition-all duration-200 flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Previous
              </button>

              {currentStep < 4 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center hover:scale-105"
                >
                  Next
                  <ArrowRight className="h-5 w-5 ml-2" />
                </button>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  disabled={loading}
                  className="px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-semibold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed flex items-center"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-3"></div>
                      Posting...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-5 w-5 mr-2" />
                      Post Job
                    </>
                  )}
                </motion.button>
              )}
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default JobCreate;