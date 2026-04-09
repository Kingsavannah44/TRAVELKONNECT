import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Globe, 
  Shield, 
  FileText, 
  GraduationCap, 
  Users, 
  Headphones,
  CheckCircle,
  ArrowRight,
  Star
} from 'lucide-react';

const Services = () => {
  const services = [
    {
      icon: Globe,
      title: 'International Job Placement',
      description: 'Connect with premium trucking companies across the US and Canada',
      features: [
        'Verified employer partnerships',
        'Competitive salary packages',
        'Multiple job categories',
        'Real-time job matching'
      ],
      color: 'from-blue-500 to-indigo-600'
    },
    {
      icon: Shield,
      title: 'Document Verification & Processing',
      description: 'Secure and fast processing of all required documentation',
      features: [
        'Digital document verification',
        'Secure cloud storage',
        'Fast processing times',
        'Compliance assurance'
      ],
      color: 'from-green-500 to-emerald-600'
    },
    {
      icon: FileText,
      title: 'Visa & Work Permit Assistance',
      description: 'Complete immigration support for US and Canadian opportunities',
      features: [
        'Visa application guidance',
        'Work permit processing',
        'Legal documentation',
        'Immigration consultation'
      ],
      color: 'from-purple-500 to-violet-600'
    },
    {
      icon: GraduationCap,
      title: 'Professional Driver Training',
      description: 'Enhance your skills with internationally recognized training programs',
      features: [
        'CDL preparation courses',
        'Safety training programs',
        'International driving standards',
        'Certification assistance'
      ],
      color: 'from-orange-500 to-red-600'
    },
    {
      icon: Users,
      title: 'Career Counseling & Guidance',
      description: 'Expert advice to accelerate your international driving career',
      features: [
        'One-on-one counseling',
        'Career path planning',
        'Interview preparation',
        'Salary negotiation tips'
      ],
      color: 'from-teal-500 to-cyan-600'
    },
    {
      icon: Headphones,
      title: '24/7 Multilingual Support',
      description: 'Round-the-clock assistance in English and Swahili',
      features: [
        'Live chat support',
        'Phone assistance',
        'Email support',
        'Emergency helpline'
      ],
      color: 'from-pink-500 to-rose-600'
    }
  ];

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-bold gradient-text mb-6">
            Our Professional Services
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Comprehensive solutions to connect Kenyan truck drivers with international opportunities. 
            From job placement to visa assistance, we've got you covered.
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                className="floating-card group"
              >
                <div className={`p-4 bg-gradient-to-r ${service.color} rounded-2xl mb-6 w-fit`}>
                  <Icon className="h-8 w-8 text-white" />
                </div>
                
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {service.title}
                </h3>
                
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {service.description}
                </p>
                
                <ul className="space-y-3 mb-6">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn-primary w-full flex items-center justify-center group"
                >
                  <Link 
                    to={`/services/${service.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '')}`}
                    className="flex items-center justify-center w-full"
                  >
                    Learn More
                    <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </motion.button>
              </motion.div>
            );
          })}
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="glass-card text-center"
        >
          <div className="flex justify-center mb-6">
            <div className="flex space-x-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-8 w-8 text-yellow-400 fill-current" />
              ))}
            </div>
          </div>
          
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to Start Your International Career?
          </h2>
          
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of successful drivers who have found their dream jobs abroad. 
            Our comprehensive services ensure your success every step of the way.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-primary"
            >
              Get Started Today
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-secondary"
            >
              Contact Our Team
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Services;