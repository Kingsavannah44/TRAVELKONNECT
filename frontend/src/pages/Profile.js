import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import {
  User,
  Phone,
  Mail,
  MapPin,
  FileText,
  Save,
  Camera,
  Truck,
  Building
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import FileUpload from '../components/FileUpload';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('personal');
  const [loading, setLoading] = useState(false);
  
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      firstName: user?.profile?.firstName || '',
      lastName: user?.profile?.lastName || '',
      phone: user?.profile?.phone || '',
      city: user?.profile?.city || '',
      country: user?.profile?.country || 'Kenya',
      // Driver specific fields
      licenseNumber: user?.driverProfile?.licenseNumber || '',
      yearsExperience: user?.driverProfile?.yearsExperience || '',
      // Employer specific fields
      companyName: user?.employerProfile?.companyName || '',
      companySize: user?.employerProfile?.companySize || '',
      website: user?.employerProfile?.website || '',
      description: user?.employerProfile?.description || ''
    }
  });

  const tabs = [
    { id: 'personal', label: 'Personal Info', icon: User },
    ...(user?.role === 'driver' ? [
      { id: 'experience', label: 'Experience', icon: Truck },
      { id: 'documents', label: 'Documents', icon: FileText }
    ] : []),
    ...(user?.role === 'employer' ? [
      { id: 'company', label: 'Company Info', icon: Building }
    ] : [])
  ];

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const profileData = {
        profile: {
          firstName: data.firstName,
          lastName: data.lastName,
          phone: data.phone,
          city: data.city,
          country: data.country
        }
      };

      if (user.role === 'driver') {
        profileData.driverProfile = {
          licenseNumber: data.licenseNumber,
          yearsExperience: parseInt(data.yearsExperience) || 0,
          truckTypes: data.truckTypes || []
        };
      }

      if (user.role === 'employer') {
        profileData.employerProfile = {
          companyName: data.companyName,
          companySize: data.companySize,
          website: data.website,
          description: data.description
        };
      }

      const result = await updateProfile(profileData);
      if (result.success) {
        toast.success(t('profile.updateSuccess'));
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleDocumentUpload = (documentType, url) => {
    // Handle document upload
    toast.success(`${documentType} uploaded successfully`);
  };

  const getVerificationStatus = () => {
    const status = user?.role === 'driver' 
      ? user?.driverProfile?.verificationStatus 
      : user?.employerProfile?.verificationStatus;
    
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      verified: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800'
    };

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[status] || colors.pending}`}>
        {status || 'pending'}
      </span>
    );
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
              <p className="text-gray-600 mt-2">
                Manage your account information and preferences
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Verification Status</p>
              {getVerificationStatus()}
            </div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="glass-card"
            >
              <div className="space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                        activeTab === tab.id
                          ? 'bg-primary-500 text-white shadow-lg'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="glass-card"
            >
              <form onSubmit={handleSubmit(onSubmit)}>
                {/* Personal Information Tab */}
                {activeTab === 'personal' && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-semibold">Personal Information</h2>
                      <button
                        type="button"
                        className="btn-secondary flex items-center"
                      >
                        <Camera className="h-4 w-4 mr-2" />
                        Change Photo
                      </button>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          First Name
                        </label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                          <input
                            {...register('firstName', { required: 'First name is required' })}
                            type="text"
                            className="input-field pl-10"
                          />
                        </div>
                        {errors.firstName && (
                          <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Last Name
                        </label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                          <input
                            {...register('lastName', { required: 'Last name is required' })}
                            type="text"
                            className="input-field pl-10"
                          />
                        </div>
                        {errors.lastName && (
                          <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                          <input
                            type="email"
                            value={user?.email || ''}
                            disabled
                            className="input-field pl-10 bg-gray-100 cursor-not-allowed"
                          />
                        </div>
                        <p className="mt-1 text-xs text-gray-500">Email cannot be changed</p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Phone Number
                        </label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                          <input
                            {...register('phone', { required: 'Phone number is required' })}
                            type="tel"
                            className="input-field pl-10"
                          />
                        </div>
                        {errors.phone && (
                          <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          City
                        </label>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                          <input
                            {...register('city')}
                            type="text"
                            className="input-field pl-10"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Country
                        </label>
                        <select
                          {...register('country')}
                          className="input-field"
                        >
                          <option value="Kenya">Kenya</option>
                          <option value="Uganda">Uganda</option>
                          <option value="Tanzania">Tanzania</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {/* Driver Experience Tab */}
                {activeTab === 'experience' && user?.role === 'driver' && (
                  <div className="space-y-6">
                    <h2 className="text-xl font-semibold">Driving Experience</h2>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          License Number
                        </label>
                        <input
                          {...register('licenseNumber')}
                          type="text"
                          className="input-field"
                          placeholder="Enter your license number"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Years of Experience
                        </label>
                        <input
                          {...register('yearsExperience')}
                          type="number"
                          min="0"
                          className="input-field"
                          placeholder="Years of driving experience"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Truck Types Experience
                      </label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {['Semi-trailer', 'Flatbed', 'Tanker', 'Refrigerated', 'Container', 'Heavy Haul'].map((type) => (
                          <label key={type} className="flex items-center">
                            <input
                              type="checkbox"
                              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                            />
                            <span className="ml-2 text-sm text-gray-700">{type}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Documents Tab */}
                {activeTab === 'documents' && user?.role === 'driver' && (
                  <div className="space-y-6">
                    <h2 className="text-xl font-semibold">Documents</h2>
                    <p className="text-gray-600">
                      Upload your required documents for verification. All documents should be clear and valid.
                    </p>

                    <div className="grid md:grid-cols-2 gap-6">
                      <FileUpload
                        label="Driving License"
                        description="Upload a clear photo of your driving license"
                        onUpload={(url) => handleDocumentUpload('license', url)}
                        currentFile={user?.driverProfile?.documents?.license}
                      />

                      <FileUpload
                        label="National ID/Passport"
                        description="Upload your national ID or passport"
                        onUpload={(url) => handleDocumentUpload('nationalId', url)}
                        currentFile={user?.driverProfile?.documents?.nationalId}
                      />

                      <FileUpload
                        label="Medical Certificate"
                        description="Upload your medical fitness certificate"
                        onUpload={(url) => handleDocumentUpload('medicalCert', url)}
                        currentFile={user?.driverProfile?.documents?.medicalCert}
                      />

                      <FileUpload
                        label="Passport (if applicable)"
                        description="Upload your passport for international opportunities"
                        onUpload={(url) => handleDocumentUpload('passport', url)}
                        currentFile={user?.driverProfile?.documents?.passport}
                      />
                    </div>
                  </div>
                )}

                {/* Company Information Tab */}
                {activeTab === 'company' && user?.role === 'employer' && (
                  <div className="space-y-6">
                    <h2 className="text-xl font-semibold">Company Information</h2>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Company Name
                        </label>
                        <div className="relative">
                          <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                          <input
                            {...register('companyName', { required: 'Company name is required' })}
                            type="text"
                            className="input-field pl-10"
                          />
                        </div>
                        {errors.companyName && (
                          <p className="mt-1 text-sm text-red-600">{errors.companyName.message}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Company Size
                        </label>
                        <select
                          {...register('companySize')}
                          className="input-field"
                        >
                          <option value="">Select company size</option>
                          <option value="1-10">1-10 employees</option>
                          <option value="11-50">11-50 employees</option>
                          <option value="51-200">51-200 employees</option>
                          <option value="201-500">201-500 employees</option>
                          <option value="500+">500+ employees</option>
                        </select>
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Website
                        </label>
                        <input
                          {...register('website')}
                          type="url"
                          className="input-field"
                          placeholder="https://www.company.com"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Company Description
                        </label>
                        <textarea
                          {...register('description')}
                          rows={4}
                          className="input-field resize-none"
                          placeholder="Tell us about your company..."
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Save Button */}
                <div className="flex justify-end pt-6 border-t border-gray-200">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={loading}
                    className="btn-primary flex items-center"
                  >
                    {loading ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    ) : (
                      <Save className="h-4 w-4 mr-2" />
                    )}
                    {loading ? 'Saving...' : 'Save Changes'}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;