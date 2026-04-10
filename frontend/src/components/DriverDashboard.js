import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Clock,
  DollarSign,
  AlertCircle,
  CheckCircle,
  Smartphone,
  FileText,
  Briefcase,
  Eye,
  XCircle,
  TrendingUp,
  Upload,
  Bell
} from 'lucide-react';
import axios from 'axios';
import LoadingSpinner from './LoadingSpinner';
import { useAuth } from '../context/AuthContext';

const DriverDashboard = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [stats, setStats] = useState({});
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [appsRes, notifRes] = await Promise.all([
        axios.get('/api/applications/my-applications?limit=5'),
        axios.get('/api/users/notifications?limit=5')
      ]);

      setApplications(appsRes.data.applications);
      setNotifications(notifRes.data);
      
      // Calculate stats
      const totalApps = appsRes.data.total;
      const pending = appsRes.data.applications.filter(app => app.status === 'pending').length;
      const interviews = appsRes.data.applications.filter(app => app.status === 'interview-scheduled').length;
      const hired = appsRes.data.applications.filter(app => app.status === 'hired').length;

      setStats({ totalApps, pending, interviews, hired });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      reviewing: 'bg-blue-100 text-blue-800',
      shortlisted: 'bg-purple-100 text-purple-800',
      'interview-scheduled': 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      hired: 'bg-emerald-100 text-emerald-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status) => {
    const icons = {
      pending: Clock,
      reviewing: Eye,
      shortlisted: CheckCircle,
      'interview-scheduled': CheckCircle,
      rejected: XCircle,
      hired: CheckCircle
    };
    const Icon = icons[status] || Clock;
    return <Icon className="h-4 w-4" />;
  };

  if (loading) return <LoadingSpinner />;

  const statCards = [
    {
      title: 'Total Applications',
      value: stats.totalApps || 0,
      icon: FileText,
      color: 'from-blue-500 to-blue-600',
      change: '+12%'
    },
    {
      title: 'Pending Review',
      value: stats.pending || 0,
      icon: Clock,
      color: 'from-yellow-500 to-yellow-600',
      change: '+5%'
    },
    {
      title: 'Interviews Scheduled',
      value: stats.interviews || 0,
      icon: CheckCircle,
      color: 'from-green-500 to-green-600',
      change: '+25%'
    },
    {
      title: 'Job Offers',
      value: stats.hired || 0,
      icon: Briefcase,
      color: 'from-purple-500 to-purple-600',
      change: '+100%'
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

      {/* Payment Status Card */}
      {user?.paymentStatus !== 'paid' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="glass-card border-l-4 border-l-red-500"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-red-100 rounded-lg">
                <AlertCircle className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-red-800">Payment Required</h3>
                <p className="text-red-600">Complete registration fee payment to apply for jobs</p>
              </div>
            </div>
            <Link
              to="/payment"
              className="btn-primary flex items-center space-x-2"
            >
              <Smartphone className="h-4 w-4" />
              <span>Pay Now</span>
            </Link>
          </div>
        </motion.div>
      )}

      {user?.paymentStatus === 'paid' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="glass-card border-l-4 border-l-green-500"
        >
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-green-800">Payment Completed</h3>
              <p className="text-green-600">You can now apply for jobs. Registration fee paid.</p>
            </div>
          </div>
        </motion.div>
      )}

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Recent Applications */}
        <div className="lg:col-span-2">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="glass-card"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold">Recent Applications</h3>
              <Link to="/applications" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                View All
              </Link>
            </div>

            <div className="space-y-4">
              {applications.length > 0 ? (
                applications.map((application) => (
                  <div
                    key={application._id}
                    className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">
                          {application.job?.title}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {application.job?.company} • {application.job?.location?.country}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Applied {new Date(application.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(application.status)}`}>
                          {getStatusIcon(application.status)}
                          <span className="ml-1 capitalize">{application.status.replace('-', ' ')}</span>
                        </span>
                        <Link
                          to={`/applications/${application._id}`}
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
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No applications yet</p>
                  <Link to="/jobs" className="btn-primary mt-4 inline-block">
                    Browse Jobs
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Quick Actions & Notifications */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="glass-card"
          >
            <h3 className="text-xl font-semibold mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Link to="/jobs" className="btn-primary w-full text-center block">
                <Briefcase className="h-4 w-4 inline mr-2" />
                Browse Jobs
              </Link>
              <Link to="/profile" className="btn-secondary w-full text-center block">
                <Upload className="h-4 w-4 inline mr-2" />
                Update Documents
              </Link>
              <Link to="/profile" className="btn-secondary w-full text-center block">
                <FileText className="h-4 w-4 inline mr-2" />
                Complete Profile
              </Link>
            </div>
          </motion.div>

          {/* Recent Notifications */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="glass-card"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold">Notifications</h3>
              <Bell className="h-5 w-5 text-gray-400" />
            </div>

            <div className="space-y-3">
              {notifications.length > 0 ? (
                notifications.slice(0, 3).map((notification) => (
                  <div
                    key={notification._id}
                    className={`p-3 rounded-lg border ${
                      notification.read ? 'bg-gray-50 border-gray-200' : 'bg-blue-50 border-blue-200'
                    }`}
                  >
                    <p className="text-sm font-medium text-gray-900">
                      {notification.title}
                    </p>
                    <p className="text-xs text-gray-600 mt-1">
                      {notification.message}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(notification.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-gray-600 text-sm">No new notifications</p>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default DriverDashboard;