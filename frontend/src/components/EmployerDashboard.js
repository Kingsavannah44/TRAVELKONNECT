import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import { motion } from 'framer-motion';
import { 
  Briefcase, 
  Users, 
  Eye, 
  Plus,
  Calendar,
  TrendingUp,
  MapPin,
  DollarSign
} from 'lucide-react';
import axios from 'axios';
import LoadingSpinner from './LoadingSpinner';

const EmployerDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [jobsRes, appsRes] = await Promise.all([
        axios.get('/api/jobs/employer/my-jobs?limit=5'),
        axios.get('/api/applications/employer/applications?limit=5')
      ]);

      setJobs(jobsRes.data.jobs);
      setApplications(appsRes.data.applications);
      
      // Calculate stats
      const totalJobs = jobsRes.data.total;
      const activeJobs = jobsRes.data.jobs.filter(job => job.status === 'active').length;
      const totalApplications = appsRes.data.total;
      const newApplications = appsRes.data.applications.filter(app => app.status === 'pending').length;

      setStats({ totalJobs, activeJobs, totalApplications, newApplications });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      active: 'bg-green-100 text-green-800',
      paused: 'bg-yellow-100 text-yellow-800',
      closed: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  if (loading) return <LoadingSpinner />;

  const statCards = [
    {
      title: 'Total Jobs Posted',
      value: stats.totalJobs || 0,
      icon: Briefcase,
      color: 'from-blue-500 to-blue-600',
      change: '+8%'
    },
    {
      title: 'Active Jobs',
      value: stats.activeJobs || 0,
      icon: TrendingUp,
      color: 'from-green-500 to-green-600',
      change: '+15%'
    },
    {
      title: 'Total Applications',
      value: stats.totalApplications || 0,
      icon: Users,
      color: 'from-purple-500 to-purple-600',
      change: '+22%'
    },
    {
      title: 'New Applications',
      value: stats.newApplications || 0,
      icon: Calendar,
      color: 'from-orange-500 to-orange-600',
      change: '+45%'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              className="glass-card card-hover"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{card.title}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{card.value}</p>
                  <div className="flex items-center mt-2">
                    <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                    <span className="text-sm text-green-600">{card.change}</span>
                  </div>
                </div>
                <div className={`p-3 rounded-lg bg-gradient-to-r ${card.color}`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Recent Jobs */}
        <div className="lg:col-span-2">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="glass-card"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold">Your Job Postings</h3>
              <Link to="/jobs/create" className="btn-primary text-sm">
                <Plus className="h-4 w-4 mr-1" />
                Post Job
              </Link>
            </div>

            <div className="space-y-4">
              {jobs.length > 0 ? (
                jobs.map((job) => (
                  <div
                    key={job._id}
                    className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{job.title}</h4>
                        <div className="flex items-center space-x-4 mt-1">
                          <div className="flex items-center text-sm text-gray-600">
                            <MapPin className="h-4 w-4 mr-1" />
                            {job.location?.city}, {job.location?.country}
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <DollarSign className="h-4 w-4 mr-1" />
                            ${job.salary?.min?.toLocaleString()} - ${job.salary?.max?.toLocaleString()}
                          </div>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          {job.applicationsCount} applications • Posted {new Date(job.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(job.status)}`}>
                          {job.status}
                        </span>
                        <Link
                          to={`/jobs/${job._id}`}
                          className="text-primary-600 hover:text-primary-700"
                        >
                          <Eye className="h-4 w-4" />
                        </Link>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No jobs posted yet</p>
                  <Link to="/jobs/create" className="btn-primary mt-4 inline-block">
                    Post Your First Job
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Recent Applications */}
        <div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="glass-card"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold">Recent Applications</h3>
              <Link to="/applications" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                View All
              </Link>
            </div>

            <div className="space-y-3">
              {applications.length > 0 ? (
                applications.slice(0, 5).map((application) => (
                  <div
                    key={application._id}
                    className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {application.driver?.profile?.firstName} {application.driver?.profile?.lastName}
                        </p>
                        <p className="text-xs text-gray-600 truncate">
                          {application.job?.title}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(application.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <Link
                        to={`/applications/${application._id}`}
                        className="text-primary-600 hover:text-primary-700 ml-2"
                      >
                        <Eye className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-600 text-sm">No applications yet</p>
              )}
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="glass-card mt-6"
          >
            <h3 className="text-xl font-semibold mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Link to="/jobs/create" className="btn-primary w-full text-center block">
                <Plus className="h-4 w-4 inline mr-2" />
                Post New Job
              </Link>
              <Link to="/applications" className="btn-secondary w-full text-center block">
                <Users className="h-4 w-4 inline mr-2" />
                Review Applications
              </Link>
              <Link to="/profile" className="btn-secondary w-full text-center block">
                <Briefcase className="h-4 w-4 inline mr-2" />
                Update Company Profile
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default EmployerDashboard;