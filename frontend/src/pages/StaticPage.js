import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Shield, FileText, Cookie, RefreshCw, Headphones } from 'lucide-react';

const pages = {
  privacy: {
    icon: Shield,
    title: 'Privacy Policy',
    lastUpdated: 'January 1, 2026',
    sections: [
      {
        heading: 'Information We Collect',
        content: 'We collect information you provide directly to us, such as your name, email address, phone number, and professional documents when you register for an account or apply for jobs on TruckConnect.'
      },
      {
        heading: 'How We Use Your Information',
        content: 'We use the information we collect to provide, maintain, and improve our services, process job applications, communicate with you about opportunities, and comply with legal obligations.'
      },
      {
        heading: 'Information Sharing',
        content: 'We share your profile information with employers when you apply for jobs. We do not sell your personal data to third parties. We may share data with service providers who assist in our operations.'
      },
      {
        heading: 'Data Security',
        content: 'We implement industry-standard security measures including encryption, secure servers, and regular security audits to protect your personal information from unauthorized access.'
      },
      {
        heading: 'Your Rights',
        content: 'You have the right to access, update, or delete your personal information at any time through your account settings. You may also contact us directly to exercise these rights.'
      },
      {
        heading: 'Contact Us',
        content: 'If you have questions about this Privacy Policy, please contact us at shadsbrian@gmail.com or call +254 715 970 249.'
      }
    ]
  },
  terms: {
    icon: FileText,
    title: 'Terms of Service',
    lastUpdated: 'January 1, 2026',
    sections: [
      {
        heading: 'Acceptance of Terms',
        content: 'By accessing and using TruckConnect, you accept and agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our platform.'
      },
      {
        heading: 'User Accounts',
        content: 'You are responsible for maintaining the confidentiality of your account credentials. You must provide accurate and complete information when registering. One person may not maintain multiple accounts.'
      },
      {
        heading: 'Driver Registration Fee',
        content: 'Drivers are required to pay a one-time registration fee of Ksh 499 to access job application features. This fee is non-refundable once the account is activated and job applications are enabled.'
      },
      {
        heading: 'Prohibited Activities',
        content: 'You may not use TruckConnect to post false information, impersonate others, engage in fraudulent activities, or violate any applicable laws. Violations may result in immediate account termination.'
      },
      {
        heading: 'Employer Responsibilities',
        content: 'Employers must post accurate job listings, respond to applications in a timely manner, and comply with all applicable employment laws in their respective countries.'
      },
      {
        heading: 'Limitation of Liability',
        content: 'TruckConnect serves as a platform connecting drivers and employers. We are not responsible for the outcome of employment relationships formed through our platform.'
      }
    ]
  },
  cookies: {
    icon: Cookie,
    title: 'Cookie Policy',
    lastUpdated: 'January 1, 2026',
    sections: [
      {
        heading: 'What Are Cookies',
        content: 'Cookies are small text files stored on your device when you visit our website. They help us provide a better user experience by remembering your preferences and login status.'
      },
      {
        heading: 'Types of Cookies We Use',
        content: 'We use essential cookies for site functionality, authentication cookies to keep you logged in, analytics cookies to understand how users interact with our platform, and preference cookies to remember your settings.'
      },
      {
        heading: 'Essential Cookies',
        content: 'These cookies are necessary for the website to function properly. They enable core features like security, account authentication, and session management. These cannot be disabled.'
      },
      {
        heading: 'Analytics Cookies',
        content: 'We use analytics cookies to understand how visitors interact with our website. This helps us improve our services. All analytics data is anonymized and aggregated.'
      },
      {
        heading: 'Managing Cookies',
        content: 'You can control and manage cookies through your browser settings. Note that disabling certain cookies may affect the functionality of our platform.'
      },
      {
        heading: 'Updates to This Policy',
        content: 'We may update this Cookie Policy from time to time. We will notify you of any significant changes by posting a notice on our website.'
      }
    ]
  },
  refund: {
    icon: RefreshCw,
    title: 'Refund Policy',
    lastUpdated: 'January 1, 2026',
    sections: [
      {
        heading: 'Registration Fee',
        content: 'The Ksh 499 driver registration fee is non-refundable once your account has been activated and you have gained access to job application features.'
      },
      {
        heading: 'Eligibility for Refund',
        content: 'Refunds may be considered if: payment was made in error, technical issues prevented account activation, or duplicate payments were processed. Each case is reviewed individually.'
      },
      {
        heading: 'How to Request a Refund',
        content: 'To request a refund, contact us within 7 days of payment at shadsbrian@gmail.com with your transaction ID, phone number used for payment, and reason for the refund request.'
      },
      {
        heading: 'Processing Time',
        content: 'Approved refunds are processed within 5-10 business days. M-Pesa refunds are typically reflected within 24-48 hours after approval.'
      },
      {
        heading: 'Premium Services',
        content: 'Fees paid for premium placement services or visa assistance are subject to individual service agreements. Please review the specific terms before purchasing any premium service.'
      },
      {
        heading: 'Contact for Refunds',
        content: 'For all refund inquiries, contact our support team at shadsbrian@gmail.com or +254 715 970 249. We aim to resolve all refund requests within 3 business days.'
      }
    ]
  },
  support: {
    icon: Headphones,
    title: '24/7 Support',
    lastUpdated: null,
    sections: [
      {
        heading: 'Contact Us',
        content: 'Our support team is available around the clock to assist you. Reach us via email at shadsbrian@gmail.com or call +254 715 970 249.'
      },
      {
        heading: 'Driver Support',
        content: 'Need help with your application, documents, or payment? Our driver support team specializes in guiding Kenyan drivers through the entire process of securing international employment.'
      },
      {
        heading: 'Employer Support',
        content: 'For help posting jobs, reviewing applications, or managing your employer account, our dedicated employer support team is ready to assist you.'
      },
      {
        heading: 'Technical Support',
        content: 'Experiencing issues with the platform? Our technical team can help resolve login problems, payment issues, document upload errors, and any other technical difficulties.'
      },
      {
        heading: 'Response Times',
        content: 'Email responses: within 2 hours. Phone support: immediate during business hours (8AM - 8PM EAT), within 4 hours outside business hours.'
      },
      {
        heading: 'Languages',
        content: 'Our support team provides assistance in English and Kiswahili to ensure all Kenyan drivers can communicate comfortably and get the help they need.'
      }
    ]
  }
};

const StaticPage = () => {
  const { pageId } = useParams();
  const page = pages[pageId];

  if (!page) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Page not found</h2>
          <Link to="/" className="text-red-400 hover:text-red-300">Go Home</Link>
        </div>
      </div>
    );
  }

  const Icon = page.icon;

  return (
    <div className="min-h-screen bg-gray-950 text-white py-10 px-4">
      <div className="max-w-3xl mx-auto">
        <Link to="/" className="inline-flex items-center space-x-2 text-gray-400 hover:text-red-400 transition-colors mb-8">
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Home</span>
        </Link>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <div className="flex items-center space-x-4 mb-4">
            <div className="p-3 bg-red-600 rounded-xl">
              <Icon className="h-7 w-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold text-white">{page.title}</h1>
              {page.lastUpdated && (
                <p className="text-gray-400 text-sm mt-1">Last updated: {page.lastUpdated}</p>
              )}
            </div>
          </div>
          <div className="h-1 w-full bg-gradient-to-r from-red-600 via-white/20 to-blue-800 rounded-full" />
        </motion.div>

        <div className="space-y-6">
          {page.sections.map((section, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              className="bg-gray-900 border border-white/10 rounded-2xl p-6 hover:border-red-600/30 transition-all"
            >
              <h2 className="text-lg font-bold text-white mb-3 flex items-center space-x-2">
                <span className="w-6 h-6 bg-red-600 rounded-full flex items-center justify-center text-xs font-bold shrink-0">{i + 1}</span>
                <span>{section.heading}</span>
              </h2>
              <p className="text-gray-300 leading-relaxed text-sm">{section.content}</p>
            </motion.div>
          ))}
        </div>

        <div className="mt-10 bg-blue-900/30 border border-blue-700/40 rounded-2xl p-6 text-center">
          <p className="text-gray-300 text-sm mb-3">Have questions about this page?</p>
          <a
            href="mailto:shadsbrian@gmail.com"
            className="inline-flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-6 py-2.5 rounded-xl font-medium transition-all text-sm"
          >
            <span>Contact Support</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default StaticPage;
