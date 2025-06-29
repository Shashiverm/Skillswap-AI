import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, MapPin, Clock, DollarSign, MessageSquare, Heart, Share2, CheckCircle, User } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { AuthModal } from '../components/Auth/AuthModal';

export const ServiceDetails: React.FC = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Mock service data
  const service = {
    id: '1',
    title: 'Professional Web Development Services',
    description: 'I create modern, responsive websites using the latest technologies including React, Node.js, and cloud deployment. With over 5 years of experience, I specialize in e-commerce platforms, business websites, and web applications.',
    provider: {
      name: 'Sarah Chen',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      rating: 4.9,
      reviews: 127,
      location: 'San Francisco, CA',
      responseTime: '2 hours',
      completionRate: '98%'
    },
    pricing: {
      hourly: 85,
      packages: [
        { name: 'Basic Website', price: 1500, description: 'Simple 5-page website with responsive design' },
        { name: 'E-commerce Store', price: 3500, description: 'Full e-commerce solution with payment integration' },
        { name: 'Web Application', price: 5000, description: 'Custom web application with database and API' }
      ]
    },
    skills: ['React', 'Node.js', 'JavaScript', 'TypeScript', 'AWS', 'MongoDB'],
    portfolio: [
      'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
      'https://images.pexels.com/photos/39284/macbook-apple-imac-computer-39284.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
      'https://images.pexels.com/photos/265087/pexels-photo-265087.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop'
    ],
    reviews: [
      {
        name: 'John Smith',
        rating: 5,
        comment: 'Excellent work! Sarah delivered exactly what I needed and more. Highly recommended!',
        date: '2 weeks ago'
      },
      {
        name: 'Lisa Wang',
        rating: 5,
        comment: 'Professional, fast, and great communication throughout the project.',
        date: '1 month ago'
      }
    ]
  };

  const handleContactAction = (action: string) => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    
    // Handle authenticated actions
    switch (action) {
      case 'book':
        window.location.href = `/book/${service.id}`;
        break;
      case 'message':
        window.location.href = '/messages';
        break;
      default:
        break;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Service Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-colors duration-300"
            >
              <div className="flex items-start justify-between mb-4">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white transition-colors duration-300">{service.title}</h1>
                <div className="flex items-center space-x-2">
                  <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                    <Heart className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  </button>
                  <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                    <Share2 className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  </button>
                </div>
              </div>
              
              <div className="flex items-center space-x-4 mb-4">
                <img
                  src={service.provider.avatar}
                  alt={service.provider.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white transition-colors duration-300">{service.provider.name}</h3>
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-500 fill-current mr-1" />
                    <span className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-300">
                      {service.provider.rating} ({service.provider.reviews} reviews)
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-gray-700 dark:text-gray-300 leading-relaxed transition-colors duration-300">{service.description}</p>

              {/* Skills */}
              <div className="mt-6">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3 transition-colors duration-300">Skills & Technologies</h4>
                <div className="flex flex-wrap gap-2">
                  {service.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm font-medium transition-colors duration-300"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Portfolio */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-colors duration-300"
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 transition-colors duration-300">Portfolio</h3>
              <div className="grid md:grid-cols-3 gap-4">
                {service.portfolio.map((image, index) => (
                  <div key={index} className="aspect-video rounded-lg overflow-hidden">
                    <img
                      src={image}
                      alt={`Portfolio ${index + 1}`}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Reviews */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-colors duration-300"
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 transition-colors duration-300">Client Reviews</h3>
              <div className="space-y-4">
                {service.reviews.map((review, index) => (
                  <div key={index} className="border-b border-gray-200 dark:border-gray-700 pb-4 last:border-b-0">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-gray-900 dark:text-white transition-colors duration-300">{review.name}</h4>
                      <span className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300">{review.date}</span>
                    </div>
                    <div className="flex items-center mb-2">
                      {[...Array(review.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-yellow-500 fill-current" />
                      ))}
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 transition-colors duration-300">{review.comment}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Pricing Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 sticky top-8 transition-colors duration-300"
            >
              <div className="text-center mb-6">
                <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2 transition-colors duration-300">
                  ${service.pricing.hourly}/hour
                </div>
                <p className="text-gray-600 dark:text-gray-400 transition-colors duration-300">Starting rate</p>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex items-center text-gray-600 dark:text-gray-400 transition-colors duration-300">
                  <MapPin className="w-4 h-4 mr-3" />
                  <span>{service.provider.location}</span>
                </div>
                <div className="flex items-center text-gray-600 dark:text-gray-400 transition-colors duration-300">
                  <Clock className="w-4 h-4 mr-3" />
                  <span>Responds in {service.provider.responseTime}</span>
                </div>
                <div className="flex items-center text-gray-600 dark:text-gray-400 transition-colors duration-300">
                  <CheckCircle className="w-4 h-4 mr-3" />
                  <span>{service.provider.completionRate} completion rate</span>
                </div>
              </div>

              {user ? (
                <div className="space-y-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleContactAction('book')}
                    className="w-full bg-blue-600 dark:bg-blue-500 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
                  >
                    Book Now
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleContactAction('message')}
                    className="w-full border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 py-3 px-4 rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center justify-center"
                  >
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Send Message
                  </motion.button>
                </div>
              ) : (
                <div className="space-y-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowAuthModal(true)}
                    className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center"
                  >
                    <User className="w-4 h-4 mr-2" />
                    Login to Book
                  </motion.button>
                  <p className="text-sm text-gray-600 dark:text-gray-400 text-center transition-colors duration-300">
                    Sign in to book services or contact this provider
                  </p>
                </div>
              )}
            </motion.div>

            {/* Package Options */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-colors duration-300"
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 transition-colors duration-300">Package Options</h3>
              <div className="space-y-4">
                {service.pricing.packages.map((pkg, index) => (
                  <div key={index} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 transition-colors duration-300">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-gray-900 dark:text-white transition-colors duration-300">{pkg.name}</h4>
                      <span className="text-lg font-bold text-blue-600 dark:text-blue-400">${pkg.price}</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-300">{pkg.description}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </div>
  );
};