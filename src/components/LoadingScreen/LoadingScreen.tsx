import React from 'react';
import { Brain } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

export const LoadingScreen: React.FC = () => {
  const { isDark } = useTheme();

  return (
    <div className={`min-h-screen flex items-center justify-center transition-colors duration-300 ${
      isDark 
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-purple-900' 
        : 'bg-gradient-to-br from-blue-50 via-white to-purple-50'
    }`}>
      <div className="text-center">
        <div className="relative mb-8">
          {/* Outer ring */}
          <div className={`animate-spin rounded-full h-20 w-20 border-4 mx-auto ${
            isDark 
              ? 'border-gray-700 border-t-blue-400' 
              : 'border-blue-200 border-t-blue-600'
          }`}></div>
          
          {/* Inner ring */}
          <div className={`absolute inset-0 animate-spin rounded-full h-20 w-20 border-4 mx-auto ${
            isDark 
              ? 'border-gray-600 border-t-purple-400' 
              : 'border-purple-200 border-t-purple-600'
          }`} style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
          
          {/* Center icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className={`p-3 rounded-full ${
              isDark 
                ? 'bg-gray-800 shadow-lg' 
                : 'bg-white shadow-lg'
            }`}>
              <Brain className={`w-6 h-6 ${
                isDark ? 'text-blue-400' : 'text-blue-600'
              }`} />
            </div>
          </div>
          
          {/* Pulse rings */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className={`w-24 h-24 rounded-full border-2 pulse-ring ${
              isDark ? 'border-blue-400/30' : 'border-blue-600/30'
            }`}></div>
          </div>
        </div>
        
        <h2 className={`text-2xl font-bold mb-2 ${
          isDark ? 'text-white' : 'text-gray-900'
        }`}>
          Loading SkillSwap AI
        </h2>
        
        <p className={`mb-6 ${
          isDark ? 'text-gray-300' : 'text-gray-600'
        }`}>
          Initializing AI-powered matching system...
        </p>
        
        {/* Loading dots */}
        <div className="flex justify-center space-x-2">
          <div className={`w-3 h-3 rounded-full animate-bounce ${
            isDark ? 'bg-blue-400' : 'bg-blue-500'
          }`}></div>
          <div className={`w-3 h-3 rounded-full animate-bounce ${
            isDark ? 'bg-purple-400' : 'bg-purple-500'
          }`} style={{ animationDelay: '0.1s' }}></div>
          <div className={`w-3 h-3 rounded-full animate-bounce ${
            isDark ? 'bg-blue-400' : 'bg-blue-500'
          }`} style={{ animationDelay: '0.2s' }}></div>
        </div>
        
        {/* Progress bar */}
        <div className={`mt-8 w-64 h-2 rounded-full mx-auto overflow-hidden ${
          isDark ? 'bg-gray-700' : 'bg-gray-200'
        }`}>
          <div className={`h-full rounded-full animate-pulse ${
            isDark 
              ? 'bg-gradient-to-r from-blue-400 to-purple-400' 
              : 'bg-gradient-to-r from-blue-500 to-purple-500'
          }`} style={{ width: '60%' }}></div>
        </div>
      </div>
    </div>
  );
};