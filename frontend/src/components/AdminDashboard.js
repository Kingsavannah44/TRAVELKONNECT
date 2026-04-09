import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Briefcase, 
  FileCheck, 
  TrendingUp,
  UserCheck,
  AlertTriangle,
  BarChart3,
  Shield
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import LoadingSpinner from './LoadingSpinner';

const AdminDashboard = () => {
  const [stats, setStats] = useState({});
  const [chartData, setChartData] = useState([]);
  const [pieData, setPieData] = useState([]);
  const [recentUsers, setRecentUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Simulate API calls for admin data
      const mockStats = {
        totalUsers: 1247,
        totalJobs: 89,
        totalApplications: 456,
        pendingVerifications: 23,
        activeDrivers: 892,
        activeEmployers: 67,
        successRate: 85
      };

      const mockChartData = [
        { month: 'Jan', users: 65, jobs: 12, applications: 45 },
        { month: 'Feb', users: 89, jobs: 18, applications: 67 },
        { month: 'Mar', users: 123, jobs: 25, applications: 89 },
        { month: 'Apr', users: 156, jobs: 32, applications: 112 },
        { month: 'May', users: 198, jobs: 28, applications: 134 },
        { month: 'Jun', users: 234, jobs: 35, applications: 156 }
      ];

      const mockPieData = [
        { name: 'Drivers', value: 892, color: '#3b82f6' },
        { name: 'Employers', value: 67, color: '#10b981' },
        { name: 'Admins', value: 5, color: '#f59e0b' }
      ];

      const mockRecentUsers = [
        { id: 1, name: 'John Doe', email: 'john@example.com', role: 'driver', status: 'pending', joinDate: '2024-01-15' },
        { id: 2, name: 'ABC Logistics', email: 'hr@abclogistics.com', role: 'employer', status: 'verified', joinDate: '2024-01-14' },
        { id: 3, name: 'Jane Smith', email: 'jane@example.com', role: 'driver', status: 'pending', joinDate: '2024-01-13' }
      ];

      setStats(mockStats);
      setChartData(mockChartData);
      setPieData(mockPieData);
      setRecentUsers(mockRecentUsers);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  const statCards = [
    {
      title: 'Total Users',
      value: stats.totalUsers || 0,
      icon: Users,
      color: 'from-blue-500 to-blue-600',
      change: '+12%'
    },
    {
      title: 'Active Jobs',
      value: stats.totalJobs || 0,
      icon: Briefcase,
      color: 'from-green-500 to-green-600',
      change: '+8%'
    },
    {
      title: 'Total Applications',
      value: stats.totalApplications || 0,
      icon: FileCheck,
      color: 'from-purple-500 to-purple-600',
      change: '+25%'
    },
    {
      title: 'Pending Verifications',
      value: stats.pendingVerifications || 0,
      icon: AlertTriangle,
      color: 'from-orange-500 to-orange-600',
      change: '-5%'
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
                    <TrendingUp className={`h-4 w-4 mr-1 ${card.change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`} />
                    <span className={`text-sm ${card.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                      {card.change}
                    </span>
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
        {/* Analytics Chart */}
        <div className="lg:col-span-2">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="glass-card"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold">Platform Growth</h3>
              <BarChart3 className="h-5 w-5 text-gray-400" />
            </div>

            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="users" fill="#3b82f6" name="New Users" />
                  <Bar dataKey="jobs" fill="#10b981" name="New Jobs" />
                  <Bar dataKey="applications" fill="#f59e0b" name="Applications" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>

        {/* User Distribution & Recent Users */}
        <div className="space-y-6">
          {/* User Distribution Pie Chart */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="glass-card"
          >
            <h3 className="text-xl font-semibold mb-4">User Distribution</h3>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center space-x-4 mt-4">
              {pieData.map((entry) => (
                <div key={entry.name} className="flex items-center">
                  <div 
                    className="w-3 h-3 rounded-full mr-2" 
                    style={{ backgroundColor: entry.color }}
                  />
                  <span className="text-sm text-gray-600">
                    {entry.name}: {entry.value}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Recent Users */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="glass-card"
          >
            <h3 className="text-xl font-semibold mb-4">Recent Registrations</h3>
            <div className="space-y-3">
              {recentUsers.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {user.name}
                    </p>
                    <p className="text-xs text-gray-600 truncate">
                      {user.email}
                    </p>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                        user.role === 'driver' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                      }`}>
                        {user.role}
                      </span>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                        user.status === 'verified' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {user.status}
                      </span>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500">
                    {new Date(user.joinDate).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="glass-card"
      >
        <h3 className="text-xl font-semibold mb-4">Admin Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="btn-primary flex items-center justify-center">
            <UserCheck className="h-4 w-4 mr-2" />
            Verify Users
          </button>
          <button className="btn-secondary flex items-center justify-center">
            <Shield className="h-4 w-4 mr-2" />
            Security Settings
          </button>
          <button className="btn-secondary flex items-center justify-center">
            <BarChart3 className="h-4 w-4 mr-2" />
            Generate Reports
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminDashboard;