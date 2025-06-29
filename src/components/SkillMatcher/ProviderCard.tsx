import React from 'react';
import { motion } from 'framer-motion';
import { Star, DollarSign, MapPin, Clock, MessageCircle, Brain, Zap, User } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { AuthModal } from '../Auth/AuthModal';

interface Provider {
  id: string;
  name: string;
  title: string;
  rating: number;
  reviews: number;
  hourlyRate: number;
  location: string;
  avatar: string;
  skills: string[];
  availability: 'available' | 'busy' | 'offline';
  description: string;
  aiScore?: number;
  matchReasons?: string[];
}

interface ProviderCardProps {
  provider: Provider;
  index: number;
  showAIScore?: boolean;
}

export const ProviderCard: React.FC<ProviderCardProps> = ({ provider, index, showAIScore = false }) => {
  const { user } = useAuth();
  const [showAuthModal, setShowAuthModal] = React.useState(false);

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case 'available': return 'text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-200';
      case 'busy': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-200';
      case 'offline': return 'text-gray-500 bg-gray-100 dark:bg-gray-700 dark:text-gray-400';
      default: return 'text-gray-500 bg-gray-100 dark:bg-gray-700 dark:text-gray-400';
    }
  };

  const getAvailabilityText = (availability: string) => {
    switch (availability) {
      case 'available': return 'Available Now';
      case 'busy': return 'Busy';
      case 'offline': return 'Offline';
      default: return 'Unknown';
    }
  };

  const getAIScoreColor = (score: number) => {
    if (score >= 0.8) return 'text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-200';
    if (score >= 0.6) return 'text-blue-600 bg-blue-100 dark:bg-blue-900 dark:text-blue-200';
    if (score >= 0.4) return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-200';
    return 'text-gray-600 bg-gray-100 dark:bg-gray-700 dark:text-gray-400';
  };

  const handleContactClick = () => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    // Navigate to contact/message page
    window.location.href = `/provider/${provider.id}`;
  };

  const handleMessageClick = () => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    // Navigate to messages
    window.location.href = '/messages';
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-lg dark:hover:shadow-2xl transition-all duration-300 p-6 relative overflow-hidden"
      >
        {/* AI Score Badge */}
        {showAIScore && provider.aiScore !== undefined && (
          <div className="absolute top-4 right-4">
            <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium transition-colors duration-300 ${getAIScoreColor(provider.aiScore)}`}>
              <Brain className="w-3 h-3 mr-1" />
              {Math.round(provider.aiScore * 100)}%
            </div>
          </div>
        )}

        <div className="flex items-start space-x-4 mb-4">
          <div className="relative">
            <img
              src={provider.avatar}
              alt={provider.name}
              className="w-16 h-16 rounded-full object-cover"
            />
            {provider.availability === 'available' && (
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
            )}
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 dark:text-white transition-colors duration-300">{provider.name}</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm transition-colors duration-300">{provider.title}</p>
            <div className="flex items-center mt-1">
              <Star className="w-4 h-4 text-yellow-500 fill-current" />
              <span className="text-sm text-gray-600 dark:text-gray-400 ml-1 transition-colors duration-300">
                {provider.rating} ({provider.reviews} reviews)
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm transition-colors duration-300">
              <DollarSign className="w-4 h-4 mr-1" />
              ${provider.hourlyRate}/hour
            </div>
            <div className={`px-2 py-1 rounded-full text-xs font-medium transition-colors duration-300 ${getAvailabilityColor(provider.availability)}`}>
              <Clock className="w-3 h-3 inline mr-1" />
              {getAvailabilityText(provider.availability)}
            </div>
          </div>

          <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm transition-colors duration-300">
            <MapPin className="w-4 h-4 mr-1" />
            {provider.location}
          </div>

          <div className="space-y-2">
            <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2 transition-colors duration-300">{provider.description}</p>
            <div className="flex flex-wrap gap-1">
              {provider.skills.slice(0, 4).map((skill, idx) => (
                <span
                  key={idx}
                  className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded-full transition-colors duration-300"
                >
                  {skill}
                </span>
              ))}
              {provider.skills.length > 4 && (
                <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded-full transition-colors duration-300">
                  +{provider.skills.length - 4} more
                </span>
              )}
            </div>
          </div>

          {/* AI Match Reasons */}
          {provider.matchReasons && provider.matchReasons.length > 0 && (
            <div className="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-3 border border-blue-200 dark:border-blue-800 transition-colors duration-300">
              <div className="flex items-center mb-2">
                <Zap className="w-4 h-4 text-blue-600 dark:text-blue-400 mr-1" />
                <span className="text-xs font-medium text-blue-800 dark:text-blue-200">AI Match Insights</span>
              </div>
              <div className="space-y-1">
                {provider.matchReasons.slice(0, 2).map((reason, idx) => (
                  <div key={idx} className="flex items-center text-xs text-blue-700 dark:text-blue-300">
                    <div className="w-1 h-1 bg-blue-500 rounded-full mr-2"></div>
                    {reason}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex space-x-3 pt-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleContactClick}
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-500 dark:to-purple-500 text-white py-2 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 dark:hover:from-blue-600 dark:hover:to-purple-600 transition-all duration-300 flex items-center justify-center"
            >
              {user ? (
                <>
                  <User className="w-4 h-4 mr-2" />
                  View Profile
                </>
              ) : (
                <>
                  <User className="w-4 h-4 mr-2" />
                  Login to Contact
                </>
              )}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleMessageClick}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-300"
            >
              <MessageCircle className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </motion.button>
          </div>
        </div>
      </motion.div>

      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </>
  );
};