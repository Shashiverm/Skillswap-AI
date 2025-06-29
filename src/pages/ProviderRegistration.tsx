import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Star, DollarSign, Users, TrendingUp, ArrowRight, Upload, MapPin, Shield } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { IDVerificationForm } from '../components/IDVerification/IDVerificationForm';
import { 
  profileService, 
  providerService, 
  idVerificationService,
  categoryService,
  skillService 
} from '../lib/database';
import toast from 'react-hot-toast';

export const ProviderRegistration: React.FC = () => {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [showIDVerification, setShowIDVerification] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<string | null>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [skills, setSkills] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    // Basic Info
    businessName: '',
    businessDescription: '',
    experienceYears: '',
    languages: ['English'],
    
    // Location & Service
    serviceRadius: '',
    isMobile: false,
    isRemote: true,
    
    // Pricing
    hourlyRateMin: '',
    hourlyRateMax: '',
    currency: 'INR',
    
    // Skills
    selectedCategory: '',
    selectedSkills: [] as string[],
    
    // Business Details
    businessRegistrationNumber: '',
    taxId: ''
  });

  useEffect(() => {
    loadInitialData();
    checkVerificationStatus();
  }, [user]);

  const loadInitialData = async () => {
    try {
      const [categoriesData, skillsData] = await Promise.all([
        categoryService.getCategories(),
        skillService.getSkills()
      ]);
      setCategories(categoriesData);
      setSkills(skillsData);
    } catch (error) {
      console.error('Failed to load data:', error);
    }
  };

  const checkVerificationStatus = async () => {
    if (!user) return;
    
    try {
      const verification = await idVerificationService.getVerificationStatus(user.id);
      setVerificationStatus(verification?.verification_status || null);
    } catch (error) {
      console.error('Failed to check verification status:', error);
    }
  };

  const benefits = [
    {
      icon: DollarSign,
      title: 'Earn More',
      description: 'Set your own rates and earn up to 40% more than traditional platforms',
      stat: 'Average ₹2,500/hour'
    },
    {
      icon: Users,
      title: 'Quality Clients',
      description: 'AI matching ensures you get clients who truly need your skills',
      stat: '95% client satisfaction'
    },
    {
      icon: TrendingUp,
      title: 'Grow Your Business',
      description: 'Build your reputation and expand your client base with our tools',
      stat: '3x faster growth'
    },
    {
      icon: Star,
      title: 'Premium Support',
      description: 'Get dedicated support and marketing assistance to succeed',
      stat: '24/7 support'
    }
  ];

  const steps = [
    {
      title: 'Basic Information',
      description: 'Tell us about yourself and your business'
    },
    {
      title: 'Skills & Expertise',
      description: 'Showcase your skills and experience'
    },
    {
      title: 'Service Details',
      description: 'Define your service area and pricing'
    },
    {
      title: 'Verification',
      description: 'Verify your identity with valid ID proof'
    },
    {
      title: 'Launch Your Profile',
      description: 'Go live and start receiving matches'
    }
  ];

  const handleNext = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkillToggle = (skillId: string) => {
    setFormData(prev => ({
      ...prev,
      selectedSkills: prev.selectedSkills.includes(skillId)
        ? prev.selectedSkills.filter(id => id !== skillId)
        : [...prev.selectedSkills, skillId]
    }));
  };

  const handleLanguageAdd = (language: string) => {
    if (language && !formData.languages.includes(language)) {
      setFormData(prev => ({
        ...prev,
        languages: [...prev.languages, language]
      }));
    }
  };

  const handleLanguageRemove = (language: string) => {
    setFormData(prev => ({
      ...prev,
      languages: prev.languages.filter(lang => lang !== language)
    }));
  };

  const handleSubmit = async () => {
    if (!user || verificationStatus !== 'verified') {
      toast.error('Please complete ID verification first');
      return;
    }

    setLoading(true);
    try {
      // Create provider profile
      await providerService.createProvider({
        user_id: user.id,
        business_name: formData.businessName,
        business_description: formData.businessDescription,
        business_registration_number: formData.businessRegistrationNumber,
        tax_id: formData.taxId,
        hourly_rate_min: parseFloat(formData.hourlyRateMin),
        hourly_rate_max: parseFloat(formData.hourlyRateMax),
        currency: formData.currency,
        experience_years: parseInt(formData.experienceYears),
        languages: formData.languages,
        service_radius: parseInt(formData.serviceRadius),
        is_mobile: formData.isMobile,
        is_remote: formData.isRemote
      });

      // Update user role to provider
      await profileService.updateProfile(user.id, { role: 'provider' });

      toast.success('Provider profile created successfully!');
      setCurrentStep(5);
    } catch (error) {
      console.error('Failed to create provider profile:', error);
      toast.error('Failed to create provider profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Business/Professional Name *
              </label>
              <input
                type="text"
                value={formData.businessName}
                onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Your business or professional name"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Professional Description *
              </label>
              <textarea
                value={formData.businessDescription}
                onChange={(e) => setFormData({ ...formData, businessDescription: e.target.value })}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Describe your services and what makes you unique..."
                required
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Years of Experience *
                </label>
                <select
                  value={formData.experienceYears}
                  onChange={(e) => setFormData({ ...formData, experienceYears: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Select experience level</option>
                  <option value="1">1 year</option>
                  <option value="2">2 years</option>
                  <option value="3">3 years</option>
                  <option value="4">4 years</option>
                  <option value="5">5 years</option>
                  <option value="6">6-10 years</option>
                  <option value="10">10+ years</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Languages Spoken
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {formData.languages.map((lang, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm flex items-center"
                    >
                      {lang}
                      {lang !== 'English' && (
                        <button
                          onClick={() => handleLanguageRemove(lang)}
                          className="ml-2 text-blue-600 hover:text-blue-800"
                        >
                          ×
                        </button>
                      )}
                    </span>
                  ))}
                </div>
                <select
                  onChange={(e) => {
                    if (e.target.value) {
                      handleLanguageAdd(e.target.value);
                      e.target.value = '';
                    }
                  }}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Add a language</option>
                  <option value="Hindi">Hindi</option>
                  <option value="Bengali">Bengali</option>
                  <option value="Telugu">Telugu</option>
                  <option value="Marathi">Marathi</option>
                  <option value="Tamil">Tamil</option>
                  <option value="Gujarati">Gujarati</option>
                  <option value="Kannada">Kannada</option>
                  <option value="Malayalam">Malayalam</option>
                  <option value="Punjabi">Punjabi</option>
                  <option value="Spanish">Spanish</option>
                  <option value="French">French</option>
                  <option value="German">German</option>
                </select>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Business Registration Number
                </label>
                <input
                  type="text"
                  value={formData.businessRegistrationNumber}
                  onChange={(e) => setFormData({ ...formData, businessRegistrationNumber: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Optional - for registered businesses"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tax ID / GST Number
                </label>
                <input
                  type="text"
                  value={formData.taxId}
                  onChange={(e) => setFormData({ ...formData, taxId: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Optional - for tax purposes"
                />
              </div>
            </div>
          </div>
        );

      case 2:
        const categorySkills = skills.filter(skill => 
          !formData.selectedCategory || skill.category_id === formData.selectedCategory
        );

        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Primary Category *
              </label>
              <select
                value={formData.selectedCategory}
                onChange={(e) => setFormData({ ...formData, selectedCategory: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Select a category</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>{category.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Skills & Expertise * (Select at least 3)
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-64 overflow-y-auto border border-gray-200 rounded-lg p-4">
                {categorySkills.map(skill => (
                  <label key={skill.id} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.selectedSkills.includes(skill.id)}
                      onChange={() => handleSkillToggle(skill.id)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">{skill.name}</span>
                  </label>
                ))}
              </div>
              <p className="text-sm text-gray-500 mt-2">
                Selected: {formData.selectedSkills.length} skills
              </p>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Minimum Hourly Rate (₹) *
                </label>
                <input
                  type="number"
                  value={formData.hourlyRateMin}
                  onChange={(e) => setFormData({ ...formData, hourlyRateMin: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="500"
                  min="0"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Maximum Hourly Rate (₹) *
                </label>
                <input
                  type="number"
                  value={formData.hourlyRateMax}
                  onChange={(e) => setFormData({ ...formData, hourlyRateMax: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="2000"
                  min="0"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Service Radius (km)
              </label>
              <input
                type="number"
                value={formData.serviceRadius}
                onChange={(e) => setFormData({ ...formData, serviceRadius: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="25"
                min="0"
              />
              <p className="text-sm text-gray-500 mt-1">
                How far are you willing to travel for on-site services?
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isMobile"
                  checked={formData.isMobile}
                  onChange={(e) => setFormData({ ...formData, isMobile: e.target.checked })}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="isMobile" className="ml-3 text-sm text-gray-700">
                  I can travel to client locations
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isRemote"
                  checked={formData.isRemote}
                  onChange={(e) => setFormData({ ...formData, isRemote: e.target.checked })}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="isRemote" className="ml-3 text-sm text-gray-700">
                  I can work remotely
                </label>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Shield className="w-16 h-16 text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Identity Verification Required</h3>
              <p className="text-gray-600 mb-6">
                To ensure trust and safety, we require all providers to verify their identity with a valid government-issued ID.
              </p>
            </div>

            {verificationStatus === 'verified' ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
                <h4 className="text-lg font-semibold text-green-900 mb-2">Verification Complete!</h4>
                <p className="text-green-700">Your identity has been successfully verified.</p>
              </div>
            ) : verificationStatus === 'pending' || verificationStatus === 'in_review' ? (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-600 mx-auto mb-4"></div>
                <h4 className="text-lg font-semibold text-yellow-900 mb-2">Verification In Progress</h4>
                <p className="text-yellow-700">
                  Your documents are being reviewed. This usually takes 2-24 hours.
                </p>
              </div>
            ) : verificationStatus === 'rejected' ? (
              <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                <div className="text-red-600 mb-4">❌</div>
                <h4 className="text-lg font-semibold text-red-900 mb-2">Verification Failed</h4>
                <p className="text-red-700 mb-4">
                  Your verification was rejected. Please submit new documents.
                </p>
                <button
                  onClick={() => setShowIDVerification(true)}
                  className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
                >
                  Retry Verification
                </button>
              </div>
            ) : (
              <div className="text-center">
                <button
                  onClick={() => setShowIDVerification(true)}
                  className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center"
                >
                  <Shield className="w-5 h-5 mr-2" />
                  Start ID Verification
                </button>
              </div>
            )}

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-900 mb-2">Accepted ID Types:</h4>
              <div className="grid grid-cols-2 gap-2 text-sm text-blue-800">
                <div>🇮🇳 Aadhaar Card</div>
                <div>🇮🇳 PAN Card</div>
                <div>🇮🇳 Driving License</div>
                <div>🇮🇳 Voter ID</div>
                <div>🌍 Passport</div>
                <div>🌍 National ID</div>
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="text-center space-y-6">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">Profile Complete!</h3>
            <p className="text-gray-600 max-w-md mx-auto">
              Your provider profile is ready to go live. You'll start receiving AI-matched 
              client requests within 24 hours.
            </p>
            <div className="bg-blue-50 rounded-lg p-6 max-w-md mx-auto">
              <h4 className="font-semibold text-blue-900 mb-3">What happens next?</h4>
              <ul className="text-sm text-blue-800 space-y-2 text-left">
                <li>• Profile review (usually within 2 hours)</li>
                <li>• AI training on your skills and preferences</li>
                <li>• First client matches delivered to your dashboard</li>
                <li>• Welcome call from our success team</li>
              </ul>
            </div>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => window.location.href = '/dashboard'}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Go to Dashboard
              </button>
              <button
                onClick={() => window.location.href = '/profile'}
                className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                View Profile
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return formData.businessName && formData.businessDescription && formData.experienceYears;
      case 2:
        return formData.selectedCategory && formData.selectedSkills.length >= 3;
      case 3:
        return formData.hourlyRateMin && formData.hourlyRateMax && 
               parseFloat(formData.hourlyRateMin) <= parseFloat(formData.hourlyRateMax);
      case 4:
        return verificationStatus === 'verified';
      default:
        return false;
    }
  };

  if (showIDVerification) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <IDVerificationForm
            onComplete={() => {
              setShowIDVerification(false);
              setVerificationStatus('pending');
              toast.success('Verification submitted! Please wait for review.');
            }}
            onCancel={() => setShowIDVerification(false)}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-purple-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl lg:text-6xl font-bold mb-6"
            >
              Become a Verified Provider
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl mb-8 max-w-3xl mx-auto"
            >
              Join thousands of professionals earning more with AI-powered client matching. 
              Complete verification and get quality leads that match your skills perfectly.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex justify-center space-x-8 text-center"
            >
              <div>
                <div className="text-3xl font-bold">₹2,500</div>
                <div className="text-blue-200">Avg. Hourly Rate</div>
              </div>
              <div>
                <div className="text-3xl font-bold">10K+</div>
                <div className="text-blue-200">Active Providers</div>
              </div>
              <div>
                <div className="text-3xl font-bold">95%</div>
                <div className="text-blue-200">Success Rate</div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose SkillSwap AI?</h2>
            <p className="text-xl text-gray-600">Join the platform that puts providers first</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="text-center p-6 rounded-xl bg-gradient-to-br from-gray-50 to-white border border-gray-200"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl mb-4">
                  <benefit.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{benefit.title}</h3>
                <p className="text-gray-600 mb-3">{benefit.description}</p>
                <div className="text-sm font-semibold text-blue-600">{benefit.stat}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Registration Form */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            {/* Progress Bar */}
            <div className="bg-gray-50 px-8 py-6">
              <div className="flex items-center justify-between mb-4">
                {steps.map((step, index) => (
                  <div key={index} className="flex items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                      index + 1 <= currentStep 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-200 text-gray-600'
                    }`}>
                      {index + 1}
                    </div>
                    {index < steps.length - 1 && (
                      <div className={`w-16 h-1 mx-2 ${
                        index + 1 < currentStep ? 'bg-blue-600' : 'bg-gray-200'
                      }`} />
                    )}
                  </div>
                ))}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{steps[currentStep - 1].title}</h3>
                <p className="text-gray-600">{steps[currentStep - 1].description}</p>
              </div>
            </div>

            {/* Form Content */}
            <div className="p-8">
              {renderStepContent()}
              
              {/* Navigation Buttons */}
              {currentStep < 5 && (
                <div className="flex justify-between mt-8">
                  <button
                    onClick={handlePrevious}
                    disabled={currentStep === 1}
                    className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Previous
                  </button>
                  <button
                    onClick={currentStep === 4 ? handleSubmit : handleNext}
                    disabled={!canProceed() || loading}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Creating Profile...
                      </>
                    ) : currentStep === 4 ? (
                      'Complete Registration'
                    ) : (
                      <>
                        Next Step
                        <ArrowRight className="ml-2 w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};