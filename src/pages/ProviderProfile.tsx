import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, MapPin, Clock, CheckCircle, Award, Calendar, MessageSquare, Heart, User, Phone, Video } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { AuthModal } from '../components/Auth/AuthModal';

export const ProviderProfile: React.FC = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Mock provider data
  const provider = {
    id: '1',
    name: 'Sarah Chen',
    title: 'Full-Stack Developer & UI/UX Designer',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop',
    rating: 4.9,
    reviews: 127,
    location: 'San Francisco, CA',
    joinDate: 'March 2022',
    responseTime: '2 hours',
    completionRate: '98%',
    totalEarnings: '$125,000+',
    bio: 'Passionate full-stack developer with 6+ years of experience creating modern web applications. I specialize in React, Node.js, and cloud technologies. My goal is to help businesses transform their ideas into powerful digital solutions.',
    skills: [
      { name: 'React', level: 'Expert', years: 5 },
      { name: 'Node.js', level: 'Expert', years: 4 },
      { name: 'JavaScript', level: 'Expert', years: 6 },
      { name: 'TypeScript', level: 'Advanced', years: 3 },
      { name: 'AWS', level: 'Advanced', years: 3 },
      { name: 'UI/UX Design', level: 'Intermediate', years: 2 }
    ],
    services: [
      {
        title: 'Web Development',
        price: 85,
        description: 'Custom web applications using modern technologies'
      },
      {
        title: 'E-commerce Solutions',
        price: 95,
        description: 'Complete e-commerce platforms with payment integration'
      },
      {
        title: 'UI/UX Design',
        price: 65,
        description: 'User-centered design for web and mobile applications'
      }
    ],
    portfolio: [
      {
        title: 'E-commerce Platform',
        image: 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
        description: 'Modern e-commerce solution with React and Node.js'
      },
      {
        title: 'SaaS Dashboard',
        image: 'https://images.pexels.com/photos/39284/macbook-apple-imac-computer-39284.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
        description: 'Analytics dashboard for business intelligence'
      },
      {
        title: 'Mobile App Design',
        image: 'https://images.pexels.com/photos/265087/pexels-photo-265087.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
        description: 'UI/UX design for fitness tracking mobile app'
      }
    ],
    reviews: [
      {
        name: 'John Smith',
        avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&fit=crop',
        rating: 5,
        comment: 'Sarah is an exceptional developer. She delivered our e-commerce platform ahead of schedule and exceeded all expectations. Highly recommended!',
        date: '2 weeks ago',
        project: 'E-commerce Website'
      },
      {
        name: 'Lisa Wang',
        avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&fit=crop',
        rating: 5,
        comment: 'Professional, communicative, and delivered exactly what we needed. The web application works flawlessly.',
        date: '1 month ago',
        project: 'Web Application'
      },
      {
        name: 'Mike Johnson',
        avatar: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&fit=crop',
        rating: 5,
        comment: 'Great attention to detail and excellent problem-solving skills. Will definitely work with Sarah again.',
        date: '2 months ago',
        project: 'Dashboard Development'
      }
    ],
    certifications: [
      'AWS Certified Solutions Architect',
      'Google Cloud Professional',
      'React Developer Certification'
    ]
  };

  const handleContactAction = (action: string) => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    
    // Handle authenticated actions
    switch (action) {
      case 'message':
        // Navigate to messages
        window.location.href = '/messages';
        break;
      case 'call':
        // Handle call functionality
        console.log('Initiating call...');
        break;
      case 'video':
        // Handle video call functionality
        console.log('Initiating video call...');
        break;
      case 'book':
        // Navigate to booking page
        window.location.href = `/book/${provider.id}`;
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
            {/* Profile Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-colors duration-300"
            >
              <div className="flex items-start space-x-6">
                <img
                  src={provider.avatar}
                  alt={provider.name}
                  className="w-24 h-24 rounded-full object-cover"
                />
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h1 className="text-2xl font-bold text-gray-900 dark:text-white transition-colors duration-300">{provider.name}</h1>
                      <p className="text-lg text-gray-600 dark:text-gray-400 mb-2 transition-colors duration-300">{provider.title}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400 transition-colors duration-300">
                        <div className="flex items-center">
                          <Star className="w-4 h-4 text-yellow-500 fill-current mr-1" />
                          <span>{provider.rating} ({provider.reviews} reviews)</span>
                        </div>
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 mr-1" />
                          <span>{provider.location}</span>
                        </div>
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          <span>Joined {provider.joinDate}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                        <Heart className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed transition-colors duration-300">{provider.bio}</p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{provider.reviews}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Reviews</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">{provider.completionRate}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Completion</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{provider.responseTime}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Response</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">{provider.totalEarnings}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Earned</div>
                </div>
              </div>
            </motion.div>

            {/* Skills */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-colors duration-300"
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 transition-colors duration-300">Skills & Expertise</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {provider.skills.map((skill, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg transition-colors duration-300">
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white transition-colors duration-300">{skill.name}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-300">{skill.years} years • {skill.level}</p>
                    </div>
                    <div className="text-right">
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                        skill.level === 'Expert' ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' :
                        skill.level === 'Advanced' ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200' :
                        'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200'
                      } transition-colors duration-300`}>
                        {skill.level}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Portfolio */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-colors duration-300"
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 transition-colors duration-300">Portfolio</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {provider.portfolio.map((item, index) => (
                  <div key={index} className="group cursor-pointer">
                    <div className="aspect-video rounded-lg overflow-hidden mb-3">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <h4 className="font-semibold text-gray-900 dark:text-white transition-colors duration-300">{item.title}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-300">{item.description}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Reviews */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-colors duration-300"
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 transition-colors duration-300">Client Reviews</h3>
              <div className="space-y-6">
                {provider.reviews.map((review, index) => (
                  <div key={index} className="border-b border-gray-200 dark:border-gray-700 pb-6 last:border-b-0">
                    <div className="flex items-start space-x-4">
                      <img
                        src={review.avatar}
                        alt={review.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <h4 className="font-semibold text-gray-900 dark:text-white transition-colors duration-300">{review.name}</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-300">{review.project}</p>
                          </div>
                          <span className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300">{review.date}</span>
                        </div>
                        <div className="flex items-center mb-2">
                          {[...Array(review.rating)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 text-yellow-500 fill-current" />
                          ))}
                        </div>
                        <p className="text-gray-700 dark:text-gray-300 transition-colors duration-300">{review.comment}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 sticky top-8 transition-colors duration-300"
            >
              <div className="text-center mb-6">
                <div className="w-2 h-2 bg-green-500 rounded-full inline-block mr-2"></div>
                <span className="text-green-600 dark:text-green-400 font-medium">Available Now</span>
              </div>

              {user ? (
                <div className="space-y-3 mb-6">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleContactAction('message')}
                    className="w-full bg-blue-600 dark:bg-blue-500 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors flex items-center justify-center"
                  >
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Send Message
                  </motion.button>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleContactAction('call')}
                      className="border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 py-2 px-3 rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center justify-center"
                    >
                      <Phone className="w-4 h-4 mr-1" />
                      Call
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleContactAction('video')}
                      className="border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 py-2 px-3 rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center justify-center"
                    >
                      <Video className="w-4 h-4 mr-1" />
                      Video
                    </motion.button>
                  </div>
                  
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleContactAction('book')}
                    className="w-full bg-green-600 dark:bg-green-500 text-white py-3 px-4 rounded-lg font-semibold hover:bg-green-700 dark:hover:bg-green-600 transition-colors"
                  >
                    Book Service
                  </motion.button>
                </div>
              ) : (
                <div className="space-y-3 mb-6">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowAuthModal(true)}
                    className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center"
                  >
                    <User className="w-4 h-4 mr-2" />
                    Login to Contact
                  </motion.button>
                  <p className="text-sm text-gray-600 dark:text-gray-400 text-center transition-colors duration-300">
                    Sign in to message, call, or book services with this provider
                  </p>
                </div>
              )}

              <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400 transition-colors duration-300">
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-3" />
                  <span>Responds in {provider.responseTime}</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 mr-3" />
                  <span>{provider.completionRate} completion rate</span>
                </div>
                <div className="flex items-center">
                  <Award className="w-4 h-4 mr-3" />
                  <span>Top Rated Provider</span>
                </div>
              </div>
            </motion.div>

            {/* Services */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-colors duration-300"
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 transition-colors duration-300">Services Offered</h3>
              <div className="space-y-4">
                {provider.services.map((service, index) => (
                  <div key={index} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 transition-colors duration-300">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-gray-900 dark:text-white transition-colors duration-300">{service.title}</h4>
                      <span className="text-lg font-bold text-blue-600 dark:text-blue-400">${service.price}/hr</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-300">{service.description}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Certifications */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-colors duration-300"
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 transition-colors duration-300">Certifications</h3>
              <div className="space-y-2">
                {provider.certifications.map((cert, index) => (
                  <div key={index} className="flex items-center">
                    <Award className="w-4 h-4 text-blue-600 dark:text-blue-400 mr-3" />
                    <span className="text-sm text-gray-700 dark:text-gray-300 transition-colors duration-300">{cert}</span>
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