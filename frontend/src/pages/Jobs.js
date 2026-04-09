import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import {
  Search,
  MapPin,
  DollarSign,
  Clock,
  Briefcase,
  ChevronRight
} from 'lucide-react';
import axios from 'axios';
import LoadingSpinner from '../components/LoadingSpinner';

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    country: '',
    experience: '',
    truckType: ''
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { t } = useTranslation();

  useEffect(() => {
    fetchJobs();
  }, [currentPage, searchTerm, filters]);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage,
        limit: 12,
        ...(searchTerm && { search: searchTerm }),
        ...Object.fromEntries(Object.entries(filters).filter(([_, v]) => v))
      });

      const response = await axios.get(`/api/jobs?${params}`);
      setJobs(response.data.jobs);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchJobs();
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const formatSalary = (job) => {
    if (job.salary?.min && job.salary?.max) {
      return `$${job.salary.min.toLocaleString()} - $${job.salary.max.toLocaleString()}`;
    }
    return 'Competitive';
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold gradient-text mb-4">
            {t('jobs.title')}
          </h1>
          <p className="text-xl text-slate-600">
            Find your next truck driving opportunity in the US and Canada
          </p>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="glass-card mb-8"
        >
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder={t('jobs.searchPlaceholder')}
                    className="input-field pl-10"
                  />
                </div>
              </div>
              <button type="submit" className="btn-primary">
                {t('common.search')}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <select
                value={filters.country}
                onChange={(e) => handleFilterChange('country', e.target.value)}
                className="input-field"
              >
                <option value="">All Countries</option>
                <option value="United States">United States</option>
                <option value="Canada">Canada</option>
              </select>

              <select
                value={filters.experience}
                onChange={(e) => handleFilterChange('experience', e.target.value)}
                className="input-field"
              >
                <option value="">Any Experience</option>
                <option value="0">Entry Level</option>
                <option value="2">2+ Years</option>
                <option value="5">5+ Years</option>
                <option value="10">10+ Years</option>
              </select>

              <select
                value={filters.truckType}
                onChange={(e) => handleFilterChange('truckType', e.target.value)}
                className="input-field"
              >
                <option value="">All Truck Types</option>
                <option value="Semi-trailer">Semi-trailer</option>
                <option value="Flatbed">Flatbed</option>
                <option value="Tanker">Tanker</option>
                <option value="Refrigerated">Refrigerated</option>
              </select>
            </div>
          </form>
        </motion.div>

        {/* Jobs Grid */}
        {loading ? (
          <LoadingSpinner />
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {jobs.map((job, index) => (
                <motion.div
                  key={job._id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                  className="glass-card card-hover"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {job.title}
                      </h3>
                      <p className="text-primary-600 font-medium">{job.company}</p>
                    </div>
                    <div className="p-2 bg-primary-100 rounded-lg">
                      <Briefcase className="h-5 w-5 text-primary-600" />
                    </div>
                  </div>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-center text-slate-600">
                      <MapPin className="h-4 w-4 mr-2" />
                      <span className="text-sm">
                        {job.location?.city && `${job.location.city}, `}
                        {job.location?.country}
                      </span>
                    </div>

                    <div className="flex items-center text-slate-600">
                      <DollarSign className="h-4 w-4 mr-2" />
                      <span className="text-sm">{formatSalary(job)}</span>
                    </div>

                    <div className="flex items-center text-slate-600">
                      <Clock className="h-4 w-4 mr-2" />
                      <span className="text-sm capitalize">{job.jobType}</span>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-slate-600 text-sm line-clamp-3">
                      {job.description}
                    </p>
                  </div>

                  {job.requirements?.truckTypes && (
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-2">
                        {job.requirements.truckTypes.slice(0, 2).map((type) => (
                          <span
                            key={type}
                            className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                          >
                            {type}
                          </span>
                        ))}
                        {job.requirements.truckTypes.length > 2 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                            +{job.requirements.truckTypes.length - 2} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">
                      {job.applicationsCount} applications
                    </span>
                    <Link
                      to={`/jobs/${job._id}`}
                      className="btn-primary text-sm flex items-center"
                    >
                      {t('jobs.viewDetails')}
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center space-x-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                      currentPage === page
                        ? 'bg-primary-500 text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
            )}

            {jobs.length === 0 && (
              <div className="text-center py-12">
                <Briefcase className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No jobs found
                </h3>
                <p className="text-gray-600">
                  Try adjusting your search criteria or check back later for new opportunities.
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Jobs;