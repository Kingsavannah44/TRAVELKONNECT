import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import DriverDashboard from '../components/DriverDashboard';
import EmployerDashboard from '../components/EmployerDashboard';
import AdminDashboard from '../components/AdminDashboard';

const Dashboard = () => {
  const { user } = useAuth();

  const renderDashboard = () => {
    switch (user?.role) {
      case 'driver':
        return <DriverDashboard />;
      case 'employer':
        return <EmployerDashboard />;
      case 'admin':
        return <AdminDashboard />;
      default:
        return (
          <div className="text-center py-12">
            <p className="text-gray-600">Invalid user role</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome, {user?.profile?.firstName}!
          </h1>
          <p className="text-gray-600 mt-2">
            {user?.role === 'driver' && 'Manage your applications and profile'}
            {user?.role === 'employer' && 'Manage your job postings and candidates'}
            {user?.role === 'admin' && 'Oversee platform operations and users'}
          </p>
        </motion.div>

        {renderDashboard()}
      </div>
    </div>
  );
};

export default Dashboard;