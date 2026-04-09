import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Truck, Globe, User, LogOut, Home, Briefcase, LayoutDashboard, ChevronDown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const { t, i18n } = useTranslation();
  const { isAuthenticated, logout } = useAuth();
  const location = useLocation();

  const toggleLanguage = (lang) => { i18n.changeLanguage(lang); setShowLangMenu(false); };
  const handleLogout = () => { logout(); setIsOpen(false); };

  const navItems = [
    { path: '/', label: t('nav.home'), icon: Home },
    { path: '/jobs', label: t('nav.jobs'), icon: Briefcase },
  ];

  const authItems = isAuthenticated ? [
    { path: '/dashboard', label: t('nav.dashboard'), icon: LayoutDashboard },
    { path: '/profile', label: t('nav.profile'), icon: User },
  ] : [
    { path: '/login', label: t('nav.login'), icon: User },
    { path: '/register', label: t('nav.register'), icon: User },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b-2 border-red-600 shadow-lg">
      {/* Top accent bar — red/white/blue stripe */}
      <div className="h-1 w-full flex">
        <div className="flex-1 bg-red-600" />
        <div className="flex-1 bg-white border-y border-gray-200" />
        <div className="flex-1 bg-blue-800" />
      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
        <div className="flex justify-between items-center h-18 py-3">

          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="p-2.5 bg-red-600 rounded-xl shadow-md"
            >
              <Truck className="h-6 w-6 text-white" />
            </motion.div>
            <div className="flex flex-col leading-tight">
              <span className="text-xl font-extrabold text-blue-900 tracking-tight">TruckConnect</span>
              <span className="text-xs text-gray-500 font-medium tracking-wide">Global Opportunities</span>
            </div>
            {/* Flags */}
            <div className="flex items-center space-x-1.5 ml-2 pl-3 border-l border-gray-200">
              <motion.img
                whileHover={{ scale: 1.15 }}
                src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 60 30'%3E%3Crect fill='%23b22234' width='60' height='30'/%3E%3Cpath d='M0,3.5h60m0,3.5H0m0,3.5h60m0,3.5H0m0,3.5h60m0,3.5H0m0,3.5h60' stroke='%23fff' stroke-width='3'/%3E%3Crect fill='%233c3b6e' width='24' height='15'/%3E%3C/svg%3E"
                alt="USA" title="United States" className="w-9 h-6 rounded shadow-sm border border-gray-200"
              />
              <motion.img
                whileHover={{ scale: 1.15 }}
                src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 60 30'%3E%3Crect fill='%23fff' width='60' height='30'/%3E%3Crect fill='%23ff0000' width='15' height='30'/%3E%3Crect fill='%23ff0000' x='45' width='15' height='30'/%3E%3Cpath fill='%23ff0000' d='M30,8l2,6h6l-5,4l2,6l-5-4l-5,4l2-6l-5-4h6z'/%3E%3C/svg%3E"
                alt="Canada" title="Canada" className="w-9 h-6 rounded shadow-sm border border-gray-200"
              />
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
                    active
                      ? 'bg-red-600 text-white shadow-md'
                      : 'text-blue-900 hover:bg-red-50 hover:text-red-600'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Right Side */}
          <div className="hidden md:flex items-center space-x-3">
            {/* Language Selector */}
            <div className="relative">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowLangMenu(!showLangMenu)}
                className="flex items-center space-x-1.5 px-3 py-2 rounded-lg border border-gray-200 text-blue-900 hover:border-red-400 hover:text-red-600 transition-all text-sm font-medium bg-white"
              >
                <Globe className="h-4 w-4" />
                <span>{i18n.language === 'sw' ? 'SW' : 'EN'}</span>
                <ChevronDown className="h-3 w-3" />
              </motion.button>
              <AnimatePresence>
                {showLangMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="absolute right-0 mt-2 w-36 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50"
                  >
                    <button onClick={() => toggleLanguage('en')} className="w-full px-4 py-2.5 text-left text-sm text-blue-900 hover:bg-red-50 hover:text-red-600 transition-colors font-medium">
                      🇺🇸 English
                    </button>
                    <button onClick={() => toggleLanguage('sw')} className="w-full px-4 py-2.5 text-left text-sm text-blue-900 hover:bg-red-50 hover:text-red-600 transition-colors font-medium">
                      🇰🇪 Kiswahili
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Auth Items */}
            {authItems.map((item) => {
              const Icon = item.icon;
              const active = location.pathname === item.path;
              return (
                <motion.div key={item.path} whileTap={{ scale: 0.95 }}>
                  <Link
                    to={item.path}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
                      active
                        ? 'bg-blue-800 text-white shadow-md'
                        : item.path === '/register'
                          ? 'bg-red-600 text-white hover:bg-red-700 shadow-md'
                          : 'text-blue-900 hover:bg-blue-50 hover:text-blue-700 border border-gray-200'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </Link>
                </motion.div>
              );
            })}

            {isAuthenticated && (
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium text-red-600 border border-red-200 hover:bg-red-50 transition-all"
              >
                <LogOut className="h-4 w-4" />
                <span>{t('nav.logout')}</span>
              </motion.button>
            )}
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg text-blue-900 hover:bg-red-50 border border-gray-200 transition-all"
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-gray-100 shadow-lg"
          >
            <div className="px-5 py-4 space-y-1">
              {[...navItems, ...authItems].map((item) => {
                const Icon = item.icon;
                const active = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg font-medium text-sm transition-all ${
                      active ? 'bg-red-600 text-white' : 'text-blue-900 hover:bg-red-50 hover:text-red-600'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}

              {isAuthenticated && (
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-3 w-full px-4 py-3 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-all"
                >
                  <LogOut className="h-5 w-5" />
                  <span>{t('nav.logout')}</span>
                </button>
              )}

              <div className="pt-3 border-t border-gray-100 flex space-x-2">
                <button
                  onClick={() => toggleLanguage('en')}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                    i18n.language === 'en' ? 'bg-red-600 text-white' : 'bg-gray-100 text-blue-900 hover:bg-red-50'
                  }`}
                >
                  🇺🇸 English
                </button>
                <button
                  onClick={() => toggleLanguage('sw')}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                    i18n.language === 'sw' ? 'bg-red-600 text-white' : 'bg-gray-100 text-blue-900 hover:bg-red-50'
                  }`}
                >
                  🇰🇪 Kiswahili
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
