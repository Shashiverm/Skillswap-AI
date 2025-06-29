import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Brain, User, LogOut, Settings, Menu, X, MessageSquare, BarChart3 } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../contexts/ThemeContext';
import { signOut } from '../../lib/supabase';
import { AuthModal } from '../Auth/AuthModal';

export const Header: React.FC = () => {
  const { user } = useAuth();
  const { isDark } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    setShowUserMenu(false);
    navigate('/');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      <header className={`sticky top-0 z-40 transition-all duration-300 ${
        isDark 
          ? 'bg-gray-900/95 backdrop-blur-md border-b border-gray-700' 
          : 'bg-white/95 backdrop-blur-md border-b border-gray-200'
      } shadow-sm`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex items-center space-x-2 cursor-pointer"
              >
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg shadow-lg">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold gradient-text">
                    SkillSwap AI
                  </h1>
                  <p className={`text-xs -mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    Smart Skill Matching
                  </p>
                </div>
              </motion.div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link 
                to="/find-services" 
                className={`font-medium transition-all duration-300 ${
                  isActive('/find-services') 
                    ? `${isDark ? 'text-blue-400' : 'text-blue-600'} border-b-2 border-blue-600 pb-1` 
                    : `${isDark ? 'text-gray-300 hover:text-blue-400' : 'text-gray-700 hover:text-blue-600'}`
                }`}
              >
                Find Services
              </Link>
              <Link 
                to="/become-provider" 
                className={`font-medium transition-all duration-300 ${
                  isActive('/become-provider') 
                    ? `${isDark ? 'text-blue-400' : 'text-blue-600'} border-b-2 border-blue-600 pb-1` 
                    : `${isDark ? 'text-gray-300 hover:text-blue-400' : 'text-gray-700 hover:text-blue-600'}`
                }`}
              >
                Become a Provider
              </Link>
              <Link 
                to="/how-it-works" 
                className={`font-medium transition-all duration-300 ${
                  isActive('/how-it-works') 
                    ? `${isDark ? 'text-blue-400' : 'text-blue-600'} border-b-2 border-blue-600 pb-1` 
                    : `${isDark ? 'text-gray-300 hover:text-blue-400' : 'text-gray-700 hover:text-blue-600'}`
                }`}
              >
                How It Works
              </Link>
            </nav>

            {/* User Actions */}
            <div className="flex items-center space-x-4">
              {user ? (
                <div className="flex items-center space-x-3">
                  {/* Quick Actions */}
                  <Link to="/messages">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`p-2 rounded-lg transition-colors relative ${
                        isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
                      }`}
                    >
                      <MessageSquare className={`w-5 h-5 ${isDark ? 'text-gray-300' : 'text-gray-600'}`} />
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                    </motion.button>
                  </Link>
                  
                  <Link to="/dashboard">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`p-2 rounded-lg transition-colors ${
                        isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
                      }`}
                    >
                      <BarChart3 className={`w-5 h-5 ${isDark ? 'text-gray-300' : 'text-gray-600'}`} />
                    </motion.button>
                  </Link>

                  {/* User Menu */}
                  <div className="relative">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setShowUserMenu(!showUserMenu)}
                      className={`flex items-center space-x-2 p-2 rounded-lg transition-colors ${
                        isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
                      }`}
                    >
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg">
                        <User className="w-4 h-4 text-white" />
                      </div>
                      <span className={`hidden md:block font-medium ${
                        isDark ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        {user.user_metadata?.full_name || user.email?.split('@')[0]}
                      </span>
                    </motion.button>

                    {showUserMenu && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -10 }}
                        className={`absolute right-0 mt-2 w-48 rounded-lg shadow-lg border py-2 ${
                          isDark 
                            ? 'bg-gray-800 border-gray-700' 
                            : 'bg-white border-gray-200'
                        }`}
                      >
                        <Link 
                          to="/profile" 
                          className={`flex items-center px-4 py-2 transition-colors ${
                            isDark 
                              ? 'text-gray-300 hover:bg-gray-700' 
                              : 'text-gray-700 hover:bg-gray-100'
                          }`}
                          onClick={() => setShowUserMenu(false)}
                        >
                          <User className="w-4 h-4 mr-3" />
                          Profile
                        </Link>
                        <Link 
                          to="/dashboard" 
                          className={`flex items-center px-4 py-2 transition-colors ${
                            isDark 
                              ? 'text-gray-300 hover:bg-gray-700' 
                              : 'text-gray-700 hover:bg-gray-100'
                          }`}
                          onClick={() => setShowUserMenu(false)}
                        >
                          <BarChart3 className="w-4 h-4 mr-3" />
                          Dashboard
                        </Link>
                        <a href="#" className={`flex items-center px-4 py-2 transition-colors ${
                          isDark 
                            ? 'text-gray-300 hover:bg-gray-700' 
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}>
                          <Settings className="w-4 h-4 mr-3" />
                          Settings
                        </a>
                        <hr className={`my-2 ${isDark ? 'border-gray-700' : 'border-gray-200'}`} />
                        <button
                          onClick={handleSignOut}
                          className={`flex items-center w-full px-4 py-2 transition-colors ${
                            isDark 
                              ? 'text-gray-300 hover:bg-gray-700' 
                              : 'text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          <LogOut className="w-4 h-4 mr-3" />
                          Sign Out
                        </button>
                      </motion.div>
                    )}
                  </div>
                </div>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowAuthModal(true)}
                  className="btn-primary"
                >
                  Sign In
                </motion.button>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className={`md:hidden p-2 rounded-lg transition-colors ${
                  isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
                }`}
              >
                {showMobileMenu ? (
                  <X className={`w-6 h-6 ${isDark ? 'text-gray-300' : 'text-gray-700'}`} />
                ) : (
                  <Menu className={`w-6 h-6 ${isDark ? 'text-gray-300' : 'text-gray-700'}`} />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {showMobileMenu && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`md:hidden py-4 border-t ${
                isDark ? 'border-gray-700' : 'border-gray-200'
              }`}
            >
              <nav className="space-y-4">
                <Link 
                  to="/find-services" 
                  className={`block font-medium transition-colors ${
                    isDark 
                      ? 'text-gray-300 hover:text-blue-400' 
                      : 'text-gray-700 hover:text-blue-600'
                  }`}
                  onClick={() => setShowMobileMenu(false)}
                >
                  Find Services
                </Link>
                <Link 
                  to="/become-provider" 
                  className={`block font-medium transition-colors ${
                    isDark 
                      ? 'text-gray-300 hover:text-blue-400' 
                      : 'text-gray-700 hover:text-blue-600'
                  }`}
                  onClick={() => setShowMobileMenu(false)}
                >
                  Become a Provider
                </Link>
                <Link 
                  to="/how-it-works" 
                  className={`block font-medium transition-colors ${
                    isDark 
                      ? 'text-gray-300 hover:text-blue-400' 
                      : 'text-gray-700 hover:text-blue-600'
                  }`}
                  onClick={() => setShowMobileMenu(false)}
                >
                  How It Works
                </Link>
                {user && (
                  <>
                    <Link 
                      to="/dashboard" 
                      className={`block font-medium transition-colors ${
                        isDark 
                          ? 'text-gray-300 hover:text-blue-400' 
                          : 'text-gray-700 hover:text-blue-600'
                      }`}
                      onClick={() => setShowMobileMenu(false)}
                    >
                      Dashboard
                    </Link>
                    <Link 
                      to="/messages" 
                      className={`block font-medium transition-colors ${
                        isDark 
                          ? 'text-gray-300 hover:text-blue-400' 
                          : 'text-gray-700 hover:text-blue-600'
                      }`}
                      onClick={() => setShowMobileMenu(false)}
                    >
                      Messages
                    </Link>
                  </>
                )}
              </nav>
            </motion.div>
          )}
        </div>
      </header>

      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </>
  );
};