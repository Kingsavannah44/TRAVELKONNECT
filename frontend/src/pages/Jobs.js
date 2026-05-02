import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, MapPin, DollarSign, Clock, Briefcase, ChevronRight, AlertCircle } from 'lucide-react';

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [allJobs, setAllJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({ country: '', experience: '', truckType: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch jobs from API
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        setError(null);

        // Build query parameters for API call
        const params = new URLSearchParams();
        if (filters.country) params.append('country', filters.country);
        if (filters.truckType) params.append('truckType', filters.truckType);
        if (searchTerm) params.append('search', searchTerm);

        const response = await fetch(`/api/jobs?${params.toString()}`);

        if (!response.ok) {
          throw new Error('Failed to fetch jobs');
        }

        const data = await response.json();
        setAllJobs(data.jobs || []);
      } catch (err) {
        console.error('Error fetching jobs:', err);
        setError('Failed to load jobs. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [searchTerm, filters]);

  // Apply client-side filtering for experience
  const filteredJobs = useMemo(() => {
    return allJobs.filter(job => {
      const matchesExperience = !filters.experience || (job.requirements?.experience || 0) <= parseInt(filters.experience);
      return matchesExperience;
    });
  }, [allJobs, filters.experience]);

  useEffect(() => {
    setJobs(filteredJobs);
  }, [filteredJobs]);

  const handleSearch = (e) => {
    e.preventDefault();
  };

  const formatSalary = (job) => {
    if (job.salary?.min && job.salary?.max) {
      return `$${job.salary.min.toLocaleString()} - $${job.salary.max.toLocaleString()} ${job.salary.currency || 'USD'}`;
    }
    return 'Competitive';
  };

  return (
    <div className="min-h-screen py-8 px-4 bg-gray-950 text-white">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-white mb-4">
            Truck Driving Jobs in <span className="text-red-500">USA</span> &amp; <span className="text-blue-400">Canada</span>
          </h1>
          <p className="text-gray-400 text-lg">Find your next international truck driving opportunity</p>
        </motion.div>

        {/* Search & Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="bg-gray-900 border border-white/10 rounded-2xl p-6 mb-8"
        >
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by title, company..."
                  className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
              <button type="submit" className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-semibold transition-all">
                Search
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <select
                value={filters.country}
                onChange={(e) => { setFilters(p => ({ ...p, country: e.target.value })); setCurrentPage(1); }}
                className="w-full px-4 py-3 bg-gray-800 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="">All Countries</option>
                <option value="United States">United States 🇺🇸</option>
                <option value="Canada">Canada 🇨🇦</option>
              </select>
              <select
                value={filters.experience}
                onChange={(e) => { setFilters(p => ({ ...p, experience: e.target.value })); setCurrentPage(1); }}
                className="w-full px-4 py-3 bg-gray-800 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="">Any Experience</option>
                <option value="0">Entry Level</option>
                <option value="2">2+ Years</option>
                <option value="5">5+ Years</option>
                <option value="10">10+ Years</option>
              </select>
              <select
                value={filters.truckType}
                onChange={(e) => { setFilters(p => ({ ...p, truckType: e.target.value })); setCurrentPage(1); }}
                className="w-full px-4 py-3 bg-gray-800 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-red-500"
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

        {/* Loading State */}
        {loading && (
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-red-500 border-t-transparent mx-auto mb-4"></div>
            <p className="text-gray-400">Loading jobs...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-16">
            <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Error Loading Jobs</h3>
            <p className="text-gray-400 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-medium transition-all"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Jobs */}
        {!loading && !error && (
          <>
            <p className="text-gray-400 mb-6 text-sm">{jobs.length} job{jobs.length !== 1 ? 's' : ''} found</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {jobs.map((job, index) => (
                <motion.div
                  key={job.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-gray-900 border border-white/10 rounded-2xl p-6 hover:border-red-600/40 transition-all duration-300 flex flex-col"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-base font-bold text-white mb-1 leading-snug">{job.title}</h3>
                      <p className="text-red-400 font-medium text-sm">{job.company}</p>
                    </div>
                    <div className="p-2 bg-red-600/10 border border-red-600/20 rounded-lg ml-3 shrink-0">
                      <Briefcase className="h-5 w-5 text-red-400" />
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-gray-400 text-sm">
                      <MapPin className="h-4 w-4 mr-2 shrink-0" />
                      {job.location?.city && `${job.location.city}, `}{job.location?.country}
                    </div>
                    <div className="flex items-center text-gray-400 text-sm">
                      <DollarSign className="h-4 w-4 mr-2 shrink-0" />
                      {formatSalary(job)}
                    </div>
                    <div className="flex items-center text-gray-400 text-sm">
                      <Clock className="h-4 w-4 mr-2 shrink-0" />
                      <span className="capitalize">{job.jobType}</span>
                    </div>
                  </div>

                  <p className="text-gray-500 text-sm line-clamp-2 mb-4 flex-1">{job.description}</p>

                  {job.requirements?.truckTypes?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {job.requirements.truckTypes.slice(0, 2).map((type) => (
                        <span key={type} className="px-2 py-0.5 bg-blue-900/30 border border-blue-700/30 text-blue-300 text-xs rounded-full">{type}</span>
                      ))}
                      {job.requirements.truckTypes.length > 2 && (
                        <span className="px-2 py-0.5 bg-gray-800 text-gray-400 text-xs rounded-full">+{job.requirements.truckTypes.length - 2} more</span>
                      )}
                    </div>
                  )}

                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5">
                    <span className="text-xs text-gray-500">{job.applications_count || 0} applicants</span>
                    <Link
                      to={`/jobs/${job.id}`}
                      className="flex items-center space-x-1 bg-red-600 hover:bg-red-700 text-white text-sm px-4 py-2 rounded-lg font-medium transition-all"
                    >
                      <span>View Details</span>
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>

            {jobs.length === 0 && (
              <div className="text-center py-16">
                <Briefcase className="h-16 w-16 text-gray-700 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">No jobs found</h3>
                <p className="text-gray-500">Try adjusting your search or filters.</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Jobs;
