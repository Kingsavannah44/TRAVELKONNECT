import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Truck, Mail, Phone, MapPin, Facebook, Twitter,
  Instagram, Linkedin, Youtube, ArrowRight, Shield, Users, Globe, Award
} from 'lucide-react';

const Footer = () => {
  const quickLinks = [
    { name: 'Home', path: '/' },
    { name: 'Browse Jobs', path: '/jobs' },
    { name: 'Our Services', path: '/services' },
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Login', path: '/login' },
    { name: 'Register', path: '/register' },
  ];

  const services = [
    { name: 'International Job Placement', path: '/services/placement' },
    { name: 'Document Verification', path: '/services/verification' },
    { name: 'Visa & Work Permit Assistance', path: '/services/visa' },
    { name: 'Professional Driver Training', path: '/services/training' },
    { name: 'Career Counseling', path: '/services/guidance' },
    { name: '24/7 Multilingual Support', path: '/pages/support' },
  ];

  const legal = [
    { name: 'Privacy Policy', path: '/pages/privacy' },
    { name: 'Terms of Service', path: '/pages/terms' },
    { name: 'Cookie Policy', path: '/pages/cookies' },
    { name: 'Refund Policy', path: '/pages/refund' },
  ];

  const socialLinks = [
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' },
    { icon: Youtube, href: '#', label: 'YouTube' },
  ];

  const stats = [
    { icon: Users, number: '10,000+', label: 'Active Drivers' },
    { icon: Truck, number: '500+', label: 'Job Opportunities' },
    { icon: Globe, number: '50+', label: 'Partner Companies' },
    { icon: Award, number: '95%', label: 'Success Rate' },
  ];

  return (
    <footer className="mt-20 bg-blue-900 text-white">
      {/* Top stripe */}
      <div className="h-1.5 w-full flex">
        <div className="flex-1 bg-red-600" />
        <div className="flex-1 bg-white" />
        <div className="flex-1 bg-red-600" />
      </div>

      {/* Stats bar */}
      <div className="bg-blue-800 border-b border-blue-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="flex items-center space-x-3"
              >
                <div className="p-2.5 bg-red-600 rounded-lg shrink-0">
                  <Icon className="h-5 w-5 text-white" />
                </div>
                <div>
                  <div className="text-xl font-bold text-white">{stat.number}</div>
                  <div className="text-blue-300 text-xs">{stat.label}</div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">

        {/* Brand */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <div className="flex items-center space-x-3 mb-5">
            <div className="p-2.5 bg-red-600 rounded-xl">
              <Truck className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-extrabold text-white tracking-tight">TruckConnect</h3>
              <p className="text-blue-300 text-xs">Global Opportunities</p>
            </div>
          </div>

          {/* Flags */}
          <div className="flex items-center space-x-2 mb-5">
            <img
              src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 60 30'%3E%3Crect fill='%23b22234' width='60' height='30'/%3E%3Cpath d='M0,3.5h60m0,3.5H0m0,3.5h60m0,3.5H0m0,3.5h60m0,3.5H0m0,3.5h60' stroke='%23fff' stroke-width='3'/%3E%3Crect fill='%233c3b6e' width='24' height='15'/%3E%3C/svg%3E"
              alt="USA" className="w-10 h-7 rounded border border-blue-600 shadow"
            />
            <img
              src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 60 30'%3E%3Crect fill='%23fff' width='60' height='30'/%3E%3Crect fill='%23ff0000' width='15' height='30'/%3E%3Crect fill='%23ff0000' x='45' width='15' height='30'/%3E%3Cpath fill='%23ff0000' d='M30,8l2,6h6l-5,4l2,6l-5-4l-5,4l2-6l-5-4h6z'/%3E%3C/svg%3E"
              alt="Canada" className="w-10 h-7 rounded border border-blue-600 shadow"
            />
            <span className="text-blue-300 text-xs font-medium">USA & Canada</span>
          </div>

          <p className="text-blue-200 text-sm leading-relaxed mb-6">
            Connecting skilled Kenyan truck drivers with premium opportunities in the United States and Canada.
          </p>

          <div className="space-y-3">
            <a href="mailto:shadsbrian@gmail.com" className="flex items-center space-x-3 text-blue-200 hover:text-red-400 transition-colors text-sm group">
              <div className="p-1.5 bg-red-600/20 rounded-lg group-hover:bg-red-600/30 transition-colors">
                <Mail className="h-4 w-4" />
              </div>
              <span>shadsbrian@gmail.com</span>
            </a>
            <div className="flex items-center space-x-3 text-blue-200 text-sm">
              <div className="p-1.5 bg-white/10 rounded-lg">
                <Phone className="h-4 w-4" />
              </div>
              <span>+254 715 970 249</span>
            </div>
            <div className="flex items-center space-x-3 text-blue-200 text-sm">
              <div className="p-1.5 bg-white/10 rounded-lg">
                <MapPin className="h-4 w-4" />
              </div>
              <span>Nairobi, Kenya</span>
            </div>
          </div>
        </motion.div>

        {/* Quick Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          viewport={{ once: true }}
        >
          <h4 className="text-white font-bold text-base mb-5 pb-2 border-b border-red-600">Quick Links</h4>
          <ul className="space-y-2.5">
            {quickLinks.map((link) => (
              <li key={link.name}>
                <Link to={link.path} className="flex items-center space-x-2 text-blue-200 hover:text-red-400 transition-colors text-sm group">
                  <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                  <span>{link.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Services */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <h4 className="text-white font-bold text-base mb-5 pb-2 border-b border-red-600">Our Services</h4>
          <ul className="space-y-2.5">
            {services.map((service) => (
              <li key={service.name}>
                <Link to={service.path} className="flex items-center space-x-2 text-blue-200 hover:text-red-400 transition-colors text-sm group">
                  <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                  <span>{service.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Legal & Newsletter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <h4 className="text-white font-bold text-base mb-5 pb-2 border-b border-red-600">Legal</h4>
          <ul className="space-y-2.5 mb-8">
            {legal.map((item) => (
              <li key={item.name}>
                <Link to={item.path} className="flex items-center space-x-2 text-blue-200 hover:text-red-400 transition-colors text-sm group">
                  <Shield className="h-3.5 w-3.5" />
                  <span>{item.name}</span>
                </Link>
              </li>
            ))}
          </ul>

          {/* Newsletter */}
          <div className="bg-blue-800 border border-blue-700 rounded-xl p-5">
            <h5 className="font-semibold text-white text-sm mb-1">Stay Updated</h5>
            <p className="text-blue-300 text-xs mb-3">Get the latest job opportunities in your inbox.</p>
            <div className="flex space-x-2">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 px-3 py-2 bg-blue-900 border border-blue-600 rounded-lg text-white placeholder-blue-400 focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
              />
              <motion.button
                whileTap={{ scale: 0.95 }}
                className="px-3 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
              >
                <ArrowRight className="h-4 w-4 text-white" />
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-blue-800 bg-blue-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5 flex flex-col sm:flex-row justify-between items-center space-y-3 sm:space-y-0">
          {/* Social */}
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <span className="text-blue-400 text-sm font-medium">Follow Us:</span>
            {socialLinks.map((social) => {
              const Icon = social.icon;
              return (
                <motion.a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.15, y: -2 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-2 bg-blue-800 hover:bg-red-600 rounded-lg text-blue-300 hover:text-white transition-all"
                  aria-label={social.label}
                >
                  <Icon className="h-4 w-4" />
                </motion.a>
              );
            })}
          </div>

          <div className="text-center sm:text-right text-blue-400 text-xs sm:text-sm">
            <span>© 2026 TruckConnect. Made with </span>
            <motion.span animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 1.2, repeat: Infinity }} className="inline-block">
              ❤️
            </motion.span>
            <span> in Kenya 🇰🇪 for USA 🇺🇸 & Canada 🇨🇦</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
