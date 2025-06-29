import React from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

export const ThemeToggle: React.FC = () => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={toggleTheme}
      className={`relative inline-flex h-8 w-16 items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
        isDark 
          ? 'bg-gradient-to-r from-purple-600 to-blue-600 focus:ring-purple-500' 
          : 'bg-gradient-to-r from-yellow-400 to-orange-500 focus:ring-yellow-500'
      }`}
      aria-label="Toggle theme"
    >
      <motion.span
        animate={{
          x: isDark ? 32 : 4,
        }}
        transition={{
          type: "spring",
          stiffness: 500,
          damping: 30
        }}
        className={`inline-block h-6 w-6 transform rounded-full transition-transform duration-300 ${
          isDark ? 'bg-gray-900' : 'bg-white'
        } shadow-lg flex items-center justify-center`}
      >
        {isDark ? (
          <Moon className="h-3 w-3 text-purple-400" />
        ) : (
          <Sun className="h-3 w-3 text-yellow-500" />
        )}
      </motion.span>
      
      {/* Background icons */}
      <div className="absolute inset-0 flex items-center justify-between px-2">
        <Sun className={`h-3 w-3 transition-opacity duration-300 ${isDark ? 'opacity-30' : 'opacity-0'} text-white`} />
        <Moon className={`h-3 w-3 transition-opacity duration-300 ${isDark ? 'opacity-0' : 'opacity-30'} text-white`} />
      </div>
    </motion.button>
  );
};