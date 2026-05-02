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
            <a
              href="https://wa.me/254715970249?text=Hello!%20I%20need%20assistance%20with%20TruckConnect%20platform."
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-3 text-blue-200 hover:text-green-400 transition-colors text-sm group"
            >
              <div className="p-1.5 bg-green-600/20 rounded-lg group-hover:bg-green-600/30 transition-colors">
                <svg
                  viewBox="0 0 24 24"
                  className="h-4 w-4 fill-current"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.742.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                </svg>
              </div>
              <span>WhatsApp Support</span>
            </a>
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
