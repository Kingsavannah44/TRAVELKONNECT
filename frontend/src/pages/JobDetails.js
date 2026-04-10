import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  MapPin, 
  DollarSign, 
  Clock, 
  Briefcase,
  Building,
  Calendar,
  Users,
  ArrowLeft,
  Send
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');

  useEffect(() => {
    fetchJob();
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchJob = async () => {
    try {
      const response = await axios.get(`/api/jobs/${id}`);
      setJob(response.data);
    } catch (error) {
      console.error('Error fetching job:', error);
      toast.error('Job not found');
      navigate('/jobs');
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      toast.error('Please login to apply for jobs');
      navigate('/login');
      return;
    }

    if (user.role !== 'driver') {
      toast.error('Only drivers can apply for jobs');
      return;
    }

    setApplying(true);
    try {
      await axios.post('/api/applications', {
        jobId: job._id,
        coverLetter
      });

      toast.success('Application submitted successfully!');
      setShowApplicationForm(false);
      setCoverLetter('');
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to submit application';
      toast.error(message);
    } finally {
      setApplying(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (!job) return null;

  const formatSalary = () => {
    if (job.salary?.min && job.salary?.max) {
      return `$${job.salary.min.toLocaleString()} - $${job.salary.max.toLocaleString()} ${job.salary.period}`;
    }
    return 'Competitive salary';
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          onClick={() => navigate('/jobs')}
          className="btn-secondary mb-6 flex items-center"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Jobs
        </motion.button>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="glass-card"
            >
              {/* Job Header */}
              <div className="border-b border-gray-200 pb-6 mb-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                      {job.title}
                    </h1>
                    <div className="flex items-center space-x-4 text-gray-600">
                      <div className="flex items-center">
                        <Building className="h-5 w-5 mr-2" />
                        <span className="font-medium">{job.company}</span>
                      </div>
                      <div className="flex items-center">
                        <MapPin className="h-5 w-5 mr-2" />
                        <span>
                          {job.location?.city && `${job.location.city}, `}
                          {job.location?.country}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="p-3 bg-primary-100 rounded-lg">
                    <Briefcase className="h-8 w-8 text-primary-600" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center">
                    <DollarSign className="h-5 w-5 text-green-600 mr-2" />
                    <div>
                      <p className="text-sm text-gray-600">Salary</p>
                      <p className="font-medium">{formatSalary()}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 text-blue-600 mr-2" />
                    <div>
                      <p className="text-sm text-gray-600">Job Type</p>
                      <p className="font-medium capitalize">{job.jobType}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Users className="h-5 w-5 text-purple-600 mr-2" />
                    <div>
                      <p className="text-sm text-gray-600">Applications</p>
                      <p className="font-medium">{job.applicationsCount}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Job Description */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Job Description</h2>
                <div className="prose prose-gray max-w-none">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                    {job.description}
                  </p>
                </div>
              </div>

              {/* Requirements */}
              {job.requirements && (
                <div className="mb-8">
                  <h2 className="text-xl font-semibold mb-4">Requirements</h2>
                  <div className="space-y-4">
                    {job.requirements.experience && (
                      <div>
                        <h3 className="font-medium text-gray-900 mb-2">Experience</h3>
                        <p className="text-gray-700">
                          {job.requirements.experience}+ years of truck driving experience
                        </p>
                      </div>
                    )}
                    
                    {job.requirements.licenseType && (
                      <div>
                        <h3 className="font-medium text-gray-900 mb-2">License Type</h3>
                        <p className="text-gray-700">{job.requirements.licenseType}</p>
                      </div>
                    )}
                    
                    {job.requirements.truckTypes && job.requirements.truckTypes.length > 0 && (
                      <div>
                        <h3 className="font-medium text-gray-900 mb-2">Truck Types</h3>
                        <div className="flex flex-wrap gap-2">
                          {job.requirements.truckTypes.map((type) => (
                            <span
                              key={type}
                              className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                            >
                              {type}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Benefits */}
              {job.benefits && job.benefits.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-xl font-semibold mb-4">Benefits</h2>
                  <ul className="space-y-2">
                    {job.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-center text-gray-700">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-3" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </motion.div>
          </div>

          {/* Sidebar */}
          <div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="glass-card sticky top-24"
            >
              <h3 className="text-lg font-semibold mb-4">Apply for this job</h3>
              
              {job.applicationDeadline && (
                <div className="flex items-center text-gray-600 mb-4">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span className="text-sm">
                    Deadline: {new Date(job.applicationDeadline).toLocaleDateString()}
                  </span>
                </div>
              )}

              {!showApplicationForm ? (
                <button
                  onClick={() => setShowApplicationForm(true)}
                  className="btn-primary w-full"
                  disabled={!isAuthenticated || user?.role !== 'driver'}
                >
                  <Send className="h-4 w-4 mr-2" />
                  Apply Now
                </button>
              ) : (
                <form onSubmit={handleApply} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cover Letter
                    </label>
                    <textarea
                      value={coverLetter}
                      onChange={(e) => setCoverLetter(e.target.value)}
                      rows={6}
                      className="input-field resize-none"
                      placeholder="Tell the employer why you're the perfect fit for this role..."
                      required
                    />
                  </div>
                  
                  <div className="flex space-x-3">
                    <button
                      type="submit"
                      disabled={applying}
                      className="btn-primary flex-1 flex items-center justify-center"
                    >
                      {applying ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      ) : (
                        <Send className="h-4 w-4 mr-2" />
                      )}
                      {applying ? 'Submitting...' : 'Submit Application'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowApplicationForm(false)}
                      className="btn-secondary"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}

              {!isAuthenticated && (
                <p className="text-sm text-gray-600 mt-4">
                  <a href="/login" className="text-primary-600 hover:text-primary-700">
                    Login
                  </a>{' '}
                  or{' '}
                  <a href="/register" className="text-primary-600 hover:text-primary-700">
                    register
                  </a>{' '}
                  to apply for this job.
                </p>
              )}

              {isAuthenticated && user?.role !== 'driver' && (
                <p className="text-sm text-red-600 mt-4">
                  Only drivers can apply for jobs.
                </p>
              )}

              {/* Company Info */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h4 className="font-medium text-gray-900 mb-3">About the Company</h4>
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">
                    <strong>Company:</strong> {job.company}
                  </p>
                  {job.employer?.employerProfile?.website && (
                    <p className="text-sm text-gray-600">
                      <strong>Website:</strong>{' '}
                      <a
                        href={job.employer.employerProfile.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary-600 hover:text-primary-700"
                      >
                        {job.employer.employerProfile.website}
                      </a>
                    </p>
                  )}
                  {job.employer?.employerProfile?.description && (
                    <p className="text-sm text-gray-700 mt-3">
                      {job.employer.employerProfile.description}
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetails;