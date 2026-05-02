import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  MapPin,
  Briefcase,
  Building,
  Calendar,
  Users,
  ArrowLeft,
  Send
} from 'lucide-react';
import toast from 'react-hot-toast';
import LoadingSpinner from '../components/LoadingSpinner';
import { useAuth } from '../context/AuthContext';

const staticJobs = [
  {
    _id: '1',
    title: "Long Haul Truck Driver - Cross Country Routes",
    company: "American Freight Solutions",
    location: { country: "United States", state: "Texas", city: "Dallas" },
    description: "Join our team of professional drivers for cross-country freight delivery. We offer competitive pay, excellent benefits, and modern equipment. Routes cover all 48 states with regular home time.",
    requirements: {
      experience: 2,
      licenseType: "CDL Class A",
      truckTypes: ["Semi-trailer", "Dry Van"],
      languages: ["English"]
    },
    salary: { min: 65000, max: 85000, currency: "USD", period: "yearly" },
    benefits: ["Health Insurance", "401k Matching", "Paid Time Off", "Equipment Bonus", "Safety Bonus"],
    jobType: "full-time",
    status: "active",
    applicationsCount: 5,
    employer: {
      employerProfile: {
        description: "Leading freight transportation company with nationwide coverage.",
        website: "https://americanfreight.com"
      }
    }
  },
  {
    _id: '2',
    title: "Regional Flatbed Driver - Home Weekly",
    company: "Steel Transport Inc",
    location: { country: "United States", state: "Pennsylvania", city: "Pittsburgh" },
    description: "Regional flatbed driver position covering Northeast and Midwest regions. Home every weekend. Hauling steel, machinery, and construction materials.",
    requirements: {
      experience: 3,
      licenseType: "CDL Class A",
      truckTypes: ["Flatbed"],
      languages: ["English"]
    },
    salary: { min: 70000, max: 90000, currency: "USD", period: "yearly" },
    benefits: ["Medical Coverage", "Dental Insurance", "Vision Insurance", "Performance Bonuses"],
    jobType: "full-time",
    status: "active",
    applicationsCount: 3,
    employer: {
      employerProfile: {
        description: "Specialized in heavy equipment transportation.",
        website: null
      }
    }
  },
  {
    _id: '3',
    title: "Refrigerated Truck Driver - Food Transport",
    company: "Fresh Logistics USA",
    location: { country: "United States", state: "California", city: "Los Angeles" },
    description: "Transport fresh produce and frozen foods across Western states. Temperature-controlled trailers, modern Peterbilt trucks. Excellent pay for experienced drivers.",
    requirements: {
      experience: 1,
      licenseType: "CDL Class A",
      truckTypes: ["Refrigerated"],
      languages: ["English"]
    },
    salary: { min: 60000, max: 75000, currency: "USD", period: "yearly" },
    benefits: ["Health Insurance", "Life Insurance", "Fuel Cards", "Overtime Pay"],
    jobType: "full-time",
    status: "active",
    applicationsCount: 8,
    employer: {
      employerProfile: {
        description: "Fresh food logistics and distribution.",
        website: "https://freshlogistics.com"
      }
    }
  },
  {
    _id: '4',
    title: "Tanker Driver - Petroleum Transport",
    company: "Energy Transport Solutions",
    location: { country: "United States", state: "Texas", city: "Houston" },
    description: "Transport petroleum products safely across Texas and surrounding states. Hazmat certified drivers needed. Competitive compensation with hazard pay.",
    requirements: {
      experience: 3,
      licenseType: "CDL Class A",
      truckTypes: ["Tanker"],
      languages: ["English"]
    },
    salary: { min: 75000, max: 95000, currency: "USD", period: "yearly" },
    benefits: ["Premium Health Plan", "Life Insurance", "Hazmat Pay", "Safety Bonuses"],
    jobType: "full-time",
    status: "active",
    applicationsCount: 2,
    employer: {
      employerProfile: {
        description: "Petroleum and chemical transportation specialists.",
        website: null
      }
    }
  },
  {
    _id: '5',
    title: "Local Delivery Driver - Home Daily",
    company: "Metro Distribution",
    location: { country: "United States", state: "Illinois", city: "Chicago" },
    description: "Local delivery routes within Chicago metro area. Home every night. Delivering to retail stores and distribution centers. Great work-life balance.",
    requirements: {
      experience: 1,
      licenseType: "CDL Class B",
      truckTypes: ["Box Truck", "Straight Truck"],
      languages: ["English"]
    },
    salary: { min: 55000, max: 68000, currency: "USD", period: "yearly" },
    benefits: ["Health Insurance", "Paid Holidays", "Overtime Pay", "Union Benefits"],
    jobType: "full-time",
    status: "active",
    applicationsCount: 10,
    employer: {
      employerProfile: {
        description: "Local distribution and delivery services.",
        website: null
      }
    }
  },
  {
    _id: '6',
    title: "Cross-Border Freight Driver - US/Canada Routes",
    company: "TransCanada Logistics",
    location: { country: "Canada", state: "Ontario", city: "Toronto" },
    description: "International freight delivery between Canada and United States. Must have valid passport and FAST card. Excellent pay for cross-border experience.",
    requirements: {
      experience: 3,
      licenseType: "Class 1 License",
      truckTypes: ["Semi-trailer", "Dry Van"],
      languages: ["English", "French"]
    },
    salary: { min: 65000, max: 85000, currency: "CAD", period: "yearly" },
    benefits: ["Health Insurance", "Retirement Plan", "Border Crossing Bonus", "Paid Vacation"],
    jobType: "full-time",
    status: "active",
    applicationsCount: 4,
    employer: {
      employerProfile: {
        description: "Cross-border logistics and transportation.",
        website: "https://transcanada.com"
      }
    }
  }
];

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [job, setJob] = useState(null);
  const [applying, setApplying] = useState(false);
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const foundJob = staticJobs.find(j => j._id === id);
    if (foundJob) {
      setJob(foundJob);
    } else {
      toast.error('Job not found');
      navigate('/jobs');
    }
    setLoading(false);
  }, [id, navigate]);

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
    // Mock application submission for demo
    setTimeout(() => {
      toast.success('Application submitted successfully!');
      setShowApplicationForm(false);
      setCoverLetter('');
      setApplying(false);
    }, 1000);
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
        <button
          onClick={() => navigate('/jobs')}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 mb-6 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Back to Jobs</span>
        </button>

        {/* Job Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{job.title}</h1>
              <div className="flex items-center space-x-4 text-gray-600">
                <div className="flex items-center space-x-1">
                  <Building className="h-5 w-5" />
                  <span>{job.company}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <MapPin className="h-5 w-5" />
                  <span>{job.location.city}, {job.location.state}, {job.location.country}</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-green-600 mb-1">{formatSalary()}</div>
              <div className="text-sm text-gray-500">{job.jobType}</div>
            </div>
          </div>

          {/* Apply Button */}
          <div className="flex justify-end">
            <button
              onClick={() => setShowApplicationForm(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors flex items-center space-x-2"
            >
              <Send className="h-5 w-5" />
              <span>Apply for Job</span>
            </button>
          </div>
        </motion.div>

        {/* Job Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Job Description</h2>
              <p className="text-gray-700 leading-relaxed">{job.description}</p>
            </motion.div>

            {/* Requirements */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Requirements</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Experience</h3>
                  <p className="text-gray-700">{job.requirements.experience} years minimum</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">License Type</h3>
                  <p className="text-gray-700">{job.requirements.licenseType}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Truck Types</h3>
                  <div className="flex flex-wrap gap-2">
                    {job.requirements.truckTypes.map((type) => (
                      <span key={type} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                        {type}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Languages</h3>
                  <div className="flex flex-wrap gap-2">
                    {job.requirements.languages.map((lang) => (
                      <span key={lang} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                        {lang}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Benefits */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Benefits</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {job.benefits.map((benefit) => (
                  <div key={benefit} className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-gray-700">{benefit}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Job Stats */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Job Overview</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Briefcase className="h-5 w-5" />
                    <span>Job Type</span>
                  </div>
                  <span className="font-semibold">{job.jobType}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Users className="h-5 w-5" />
                    <span>Applications</span>
                  </div>
                  <span className="font-semibold">{job.applicationsCount}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Calendar className="h-5 w-5" />
                    <span>Posted</span>
                  </div>
                  <span className="font-semibold">Recently</span>
                </div>
              </div>
            </motion.div>

            {/* Employer Info */}
            {job.employer?.employerProfile && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">About the Employer</h3>
                <p className="text-gray-700 mb-4">{job.employer.employerProfile.description}</p>
                {job.employer.employerProfile.website && (
                  <a
                    href={job.employer.employerProfile.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 font-semibold"
                  >
                    Visit Website
                  </a>
                )}
              </motion.div>
            )}
          </div>
        </div>

        {/* Application Modal */}
        {showApplicationForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-lg shadow-xl max-w-md w-full p-6"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-4">Apply for this Job</h3>
              <form onSubmit={handleApply}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cover Letter (Optional)
                  </label>
                  <textarea
                    value={coverLetter}
                    onChange={(e) => setCoverLetter(e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Tell us why you're interested in this position..."
                  />
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowApplicationForm(false)}
                    className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={applying}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
                  >
                    {applying ? 'Submitting...' : 'Submit Application'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobDetails;