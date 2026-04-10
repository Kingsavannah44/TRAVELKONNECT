import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import {
  Truck, Users, Globe, Shield, CheckCircle, ArrowRight,
  MapPin, DollarSign, Clock, Star
} from 'lucide-react';

const Home = () => {
  useTranslation();

  const features = [
    { icon: Globe, title: 'Global Opportunities', description: 'Connect with top employers across the US and Canada directly from Kenya.' },
    { icon: Shield, title: 'Secure Platform', description: 'Verified employers and encrypted document handling you can trust.' },
    { icon: Users, title: 'Expert Support', description: '24/7 multilingual support throughout your entire application journey.' },
    { icon: CheckCircle, title: 'Easy Process', description: 'Simple multi-step application — from profile to job offer.' },
  ];

  const stats = [
    { number: '500+', label: 'Active Jobs' },
    { number: '1,000+', label: 'Registered Drivers' },
    { number: '200+', label: 'Partner Companies' },
    { number: '95%', label: 'Success Rate' },
  ];

  return (
    <div className="min-h-screen bg-gray-950 text-white">

      {/* Hero Section */}
      <section className="relative py-24 px-4 overflow-hidden">
        {/* Background layers */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-blue-950 to-gray-900" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(185,28,28,0.15),_transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_rgba(30,58,138,0.2),_transparent_60%)]" />

        {/* Subtle grid overlay */}
        <div className="absolute inset-0 opacity-5"
          style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '60px 60px' }}
        />

        <div className="relative max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-14 items-center">

            {/* Left — headline */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center space-x-2 bg-red-600/10 border border-red-600/30 rounded-full px-4 py-1.5"
              >
                <Star className="h-3.5 w-3.5 text-red-400 fill-current" />
                <span className="text-red-400 text-sm font-medium">#1 Truck Driver Placement Platform</span>
              </motion.div>

              <h1 className="text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight">
                Connect Kenyan{' '}
                <span className="text-red-500">Truck Drivers</span>
                <br />
                with{' '}
                <span className="bg-gradient-to-r from-blue-400 to-blue-300 bg-clip-text text-transparent">
                  Global Opportunities
                </span>
              </h1>

              <p className="text-lg text-gray-300 leading-relaxed max-w-lg">
                Bridge the gap between skilled truck drivers in Kenya and premium employment
                opportunities in the <span className="text-white font-semibold">United States</span> and{' '}
                <span className="text-white font-semibold">Canada</span>.
              </p>

              {/* Flags */}
              <div className="flex items-center space-x-3">
                <img
                  src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 60 30'%3E%3Crect fill='%23b22234' width='60' height='30'/%3E%3Cpath d='M0,3.5h60m0,3.5H0m0,3.5h60m0,3.5H0m0,3.5h60m0,3.5H0m0,3.5h60' stroke='%23fff' stroke-width='3'/%3E%3Crect fill='%233c3b6e' width='24' height='15'/%3E%3C/svg%3E"
                  alt="USA" className="w-10 h-7 rounded shadow-lg border border-white/10"
                />
                <img
                  src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 60 30'%3E%3Crect fill='%23fff' width='60' height='30'/%3E%3Crect fill='%23ff0000' width='15' height='30'/%3E%3Crect fill='%23ff0000' x='45' width='15' height='30'/%3E%3Cpath fill='%23ff0000' d='M30,8l2,6h6l-5,4l2,6l-5-4l-5,4l2-6l-5-4h6z'/%3E%3C/svg%3E"
                  alt="Canada" className="w-10 h-7 rounded shadow-lg border border-white/10"
                />
                <span className="text-gray-400 text-sm">Opportunities in USA & Canada</span>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/register" className="flex items-center justify-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-7 py-3.5 rounded-xl font-semibold transition-all duration-200 shadow-lg shadow-red-900/40 hover:shadow-red-900/60 hover:-translate-y-0.5">
                  <span>Get Started Today</span>
                  <ArrowRight className="h-5 w-5" />
                </Link>
                <Link to="/jobs" className="flex items-center justify-center space-x-2 bg-white/5 hover:bg-white/10 border border-white/20 text-white px-7 py-3.5 rounded-xl font-semibold transition-all duration-200 hover:-translate-y-0.5">
                  <span>Browse Jobs</span>
                </Link>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-4 gap-4 pt-2">
                {stats.map((stat, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 * i + 0.4 }}
                    className="text-center"
                  >
                    <div className="text-2xl font-bold text-red-400">{stat.number}</div>
                    <div className="text-xs text-gray-400 mt-0.5">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Right — card */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="bg-gray-900 border border-white/10 rounded-2xl p-8 shadow-2xl space-y-6">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-red-600 rounded-xl">
                    <Truck className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-white">Quick Application</h3>
                    <p className="text-gray-400 text-sm">Start your journey in minutes</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {[
                    { icon: MapPin, text: 'Multiple locations in USA & Canada', color: 'text-red-400' },
                    { icon: DollarSign, text: 'Competitive international salaries', color: 'text-green-400' },
                    { icon: Clock, text: 'Fast processing & visa support', color: 'text-blue-400' },
                  ].map(({ icon: Icon, text, color }, i) => (
                    <div key={i} className="flex items-center space-x-3 p-3 bg-white/5 rounded-xl">
                      <Icon className={`h-5 w-5 ${color} shrink-0`} />
                      <span className="text-gray-300 text-sm">{text}</span>
                    </div>
                  ))}
                </div>

                <Link to="/register" className="block w-full text-center bg-red-600 hover:bg-red-700 text-white py-3.5 rounded-xl font-semibold transition-all duration-200 shadow-lg shadow-red-900/30">
                  Start Application
                </Link>

                <p className="text-center text-gray-500 text-xs">
                  Free to register · No hidden fees
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <h2 className="text-4xl font-extrabold mb-4">
              Why Choose <span className="text-red-500">TruckConnect</span>?
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              A comprehensive platform that makes international truck driving opportunities accessible to every Kenyan driver.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * i, duration: 0.6 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -4 }}
                  className="bg-gray-800 border border-white/10 rounded-2xl p-6 hover:border-red-600/40 transition-all duration-300"
                >
                  <div className="p-3 bg-red-600/10 border border-red-600/20 rounded-xl w-fit mb-4">
                    <Icon className="h-6 w-6 text-red-400" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{feature.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gray-950 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(185,28,28,0.12),_transparent_70%)]" />
        <div className="relative max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <h2 className="text-4xl font-extrabold leading-tight">
              Ready to Start Your{' '}
              <span className="text-red-500">International</span> Driving Career?
            </h2>
            <p className="text-gray-400 text-lg">
              Join thousands of Kenyan drivers who have found life-changing opportunities abroad.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register" className="bg-red-600 hover:bg-red-700 text-white px-8 py-3.5 rounded-xl font-semibold transition-all duration-200 shadow-lg shadow-red-900/40 hover:-translate-y-0.5">
                Register as Driver
              </Link>
              <Link to="/register" className="bg-blue-800 hover:bg-blue-700 text-white px-8 py-3.5 rounded-xl font-semibold transition-all duration-200 hover:-translate-y-0.5">
                Post Jobs as Employer
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
