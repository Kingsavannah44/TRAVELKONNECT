import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Globe,
  Shield,
  FileText,
  CheckCircle,
  Star,
  DollarSign,
  Phone,
  Mail,
  MessageCircle,
  ArrowLeft,
  Award,
  Target
} from 'lucide-react';

const ServiceDetail = () => {
  const { serviceId } = useParams();
  const [activeTab, setActiveTab] = useState('specs');

  const serviceData = {
    placement: {
      icon: Globe,
      title: 'International Job Placement',
      description: 'Premium job matching service connecting Kenyan drivers with top US & Canadian employers',
      color: 'from-blue-500 to-indigo-600',
      specs: {
        duration: '2-4 weeks',
        successRate: '95%',
        countries: ['United States', 'Canada'],
        jobTypes: ['Long Haul', 'Regional', 'Local Delivery', 'Specialized Transport'],
        salaryRange: '$45,000 - $120,000 USD',
        benefits: ['Health Insurance', 'Visa Sponsorship', 'Housing Assistance', 'Equipment Provided']
      },
      pricing: {
        basic: { price: 'Free', features: ['Job Search Access', 'Basic Profile', 'Email Support'] },
        premium: { price: '$299', features: ['Priority Matching', 'Interview Coaching', 'Document Review', '24/7 Support'] },
        enterprise: { price: '$599', features: ['Guaranteed Placement', 'Visa Assistance', 'Relocation Support', 'Personal Manager'] }
      },
      reviews: [
        { name: 'John Kamau', rating: 5, text: 'Found my dream job in Texas within 3 weeks! Excellent service.' },
        { name: 'Mary Wanjiku', rating: 5, text: 'Professional team helped me secure a position in Ontario. Highly recommended!' },
        { name: 'Peter Ochieng', rating: 4, text: 'Great experience, good communication throughout the process.' }
      ]
    },
    verification: {
      icon: Shield,
      title: 'Document Verification & Processing',
      description: 'Secure, fast processing of all required documentation for international employment',
      color: 'from-green-500 to-emerald-600',
      specs: {
        duration: '3-7 days',
        successRate: '99.8%',
        documents: ['Driving License', 'National ID', 'Medical Certificate', 'Educational Certificates'],
        security: 'Bank-level encryption',
        storage: 'Secure cloud storage',
        compliance: ['GDPR', 'SOC 2', 'ISO 27001']
      },
      pricing: {
        basic: { price: '$49', features: ['Document Scan', 'Basic Verification', 'Email Delivery'] },
        premium: { price: '$99', features: ['Express Processing', 'Notarization', 'Apostille Service', 'Priority Support'] },
        enterprise: { price: '$199', features: ['Full Legal Review', 'Embassy Coordination', 'Rush Processing', 'Dedicated Agent'] }
      },
      reviews: [
        { name: 'Samuel Kiprotich', rating: 5, text: 'Documents processed quickly and securely. Very professional service.' },
        { name: 'Grace Muthoni', rating: 5, text: 'Helped me get all documents ready for my US application. Excellent!' },
        { name: 'David Otieno', rating: 5, text: 'Fast, reliable, and secure. Highly recommend their services.' }
      ]
    },
    visa: {
      icon: FileText,
      title: 'Visa & Work Permit Assistance',
      description: 'Complete immigration support for US and Canadian work opportunities',
      color: 'from-purple-500 to-violet-600',
      specs: {
        duration: '4-12 weeks',
        successRate: '92%',
        visaTypes: ['H-2B', 'TN Visa', 'Work Permit', 'Temporary Resident'],
        countries: ['United States', 'Canada'],
        support: 'Legal consultation included',
        followUp: 'Status tracking & updates'
      },
      pricing: {
        basic: { price: '$399', features: ['Application Review', 'Document Prep', 'Basic Consultation'] },
        premium: { price: '$799', features: ['Full Application Service', 'Legal Review', 'Interview Prep', 'Appeal Support'] },
        enterprise: { price: '$1299', features: ['Guaranteed Service', 'Lawyer Consultation', 'Embassy Liaison', 'Rush Processing'] }
      },
      reviews: [
        { name: 'Michael Njoroge', rating: 5, text: 'Got my H-2B visa approved! Their legal team is outstanding.' },
        { name: 'Agnes Wambui', rating: 4, text: 'Professional service, helped navigate the complex process.' },
        { name: 'Robert Mwangi', rating: 5, text: 'Excellent support throughout the visa application process.' }
      ]
    }
  };

  const service = serviceData[serviceId];
  if (!service) return <div>Service not found</div>;

  const Icon = service.icon;
  const avgRating = service.reviews.reduce((acc, review) => acc + review.rating, 0) / service.reviews.length;

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <Link to="/services" className="btn-secondary mb-8 inline-flex items-center">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Services
        </Link>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card mb-8"
        >
          <div className="flex items-start space-x-6">
            <div className={`p-6 bg-gradient-to-r ${service.color} rounded-2xl`}>
              <Icon className="h-12 w-12 text-white" />
            </div>
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">{service.title}</h1>
              <p className="text-xl text-gray-600 mb-6">{service.description}</p>
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`h-5 w-5 ${i < avgRating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                    ))}
                  </div>
                  <span className="text-gray-600">({service.reviews.length} reviews)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Award className="h-5 w-5 text-green-500" />
                  <span className="text-green-600 font-medium">Verified Service</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="flex space-x-1 mb-8 bg-gray-100 p-1 rounded-2xl">
          {[
            { id: 'specs', label: 'Specifications', icon: Target },
            { id: 'pricing', label: 'Pricing', icon: DollarSign },
            { id: 'reviews', label: 'Reviews', icon: Star },
            { id: 'contact', label: 'Contact', icon: Phone }
          ].map((tab) => {
            const TabIcon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center space-x-2 py-3 px-6 rounded-xl font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-white text-blue-600 shadow-lg'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <TabIcon className="h-5 w-5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Specifications */}
          {activeTab === 'specs' && (
            <div className="glass-card">
              <h2 className="text-2xl font-bold mb-6">Service Specifications</h2>
              <div className="grid md:grid-cols-2 gap-8">
                {Object.entries(service.specs).map(([key, value]) => (
                  <div key={key} className="flex items-start space-x-4">
                    <CheckCircle className="h-6 w-6 text-green-500 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold capitalize text-gray-900 mb-1">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </h3>
                      <p className="text-gray-600">
                        {Array.isArray(value) ? value.join(', ') : value}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Pricing */}
          {activeTab === 'pricing' && (
            <div className="grid md:grid-cols-3 gap-8">
              {Object.entries(service.pricing).map(([plan, details]) => (
                <motion.div
                  key={plan}
                  whileHover={{ scale: 1.05 }}
                  className={`glass-card text-center ${plan === 'premium' ? 'ring-2 ring-blue-500' : ''}`}
                >
                  {plan === 'premium' && (
                    <div className="bg-blue-500 text-white text-sm font-medium py-2 px-4 rounded-t-2xl -mt-8 -mx-8 mb-6">
                      Most Popular
                    </div>
                  )}
                  <h3 className="text-2xl font-bold capitalize mb-4">{plan}</h3>
                  <div className="text-4xl font-bold text-blue-600 mb-6">{details.price}</div>
                  <ul className="space-y-3 mb-8">
                    {details.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center space-x-2">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <button className={`w-full py-3 rounded-xl font-medium transition-all ${
                    plan === 'premium' 
                      ? 'bg-blue-600 text-white hover:bg-blue-700' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}>
                    Choose {plan}
                  </button>
                </motion.div>
              ))}
            </div>
          )}

          {/* Reviews */}
          {activeTab === 'reviews' && (
            <div className="space-y-6">
              {service.reviews.map((review, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="glass-card"
                >
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                      {review.name.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="font-semibold">{review.name}</h4>
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`h-4 w-4 ${i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-600">{review.text}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Contact */}
          {activeTab === 'contact' && (
            <div className="grid md:grid-cols-2 gap-8">
              <div className="glass-card">
                <h2 className="text-2xl font-bold mb-6">Get in Touch</h2>
                <div className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-blue-100 rounded-xl">
                      <Phone className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Phone Support</h3>
                      <p className="text-gray-600">+254 715 970 249</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-green-100 rounded-xl">
                      <Mail className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Email Support</h3>
                      <p className="text-gray-600">shadsbrian@gmail.com</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-purple-100 rounded-xl">
                      <MessageCircle className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Live Chat</h3>
                      <p className="text-gray-600">Available 24/7</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="glass-card">
                <h2 className="text-2xl font-bold mb-6">Send Message</h2>
                <form className="space-y-4">
                  <input
                    type="text"
                    placeholder="Your Name"
                    className="input-field"
                  />
                  <input
                    type="email"
                    placeholder="Your Email"
                    className="input-field"
                  />
                  <textarea
                    rows={4}
                    placeholder="Your Message"
                    className="input-field resize-none"
                  />
                  <button className="btn-primary w-full">
                    Send Message
                  </button>
                </form>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default ServiceDetail;