import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Header } from './components/Header/Header';
import { Home } from './pages/Home';
import { FindServices } from './pages/FindServices';
import { BecomeProvider } from './pages/BecomeProvider';
import { ProviderRegistration } from './pages/ProviderRegistration';
import { HowItWorks } from './pages/HowItWorks';
import { Profile } from './pages/Profile';
import { Dashboard } from './pages/Dashboard';
import { Messages } from './pages/Messages';
import { ServiceDetails } from './pages/ServiceDetails';
import { ProviderProfile } from './pages/ProviderProfile';
import { BookingPage } from './pages/BookingPage';
import { useAuth } from './hooks/useAuth';
import { LoadingScreen } from './components/LoadingScreen/LoadingScreen';
import { ThemeToggle } from './components/ThemeToggle/ThemeToggle';

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: 'var(--toast-bg)',
              color: 'var(--toast-color)',
            },
            success: {
              duration: 3000,
              iconTheme: {
                primary: '#10B981',
                secondary: '#fff',
              },
            },
            error: {
              duration: 5000,
              iconTheme: {
                primary: '#EF4444',
                secondary: '#fff',
              },
            },
          }}
        />
        
        <Header />
        
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/find-services" element={<FindServices />} />
          <Route path="/become-provider" element={<BecomeProvider />} />
          <Route path="/provider-registration" element={user ? <ProviderRegistration /> : <Home />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/profile" element={user ? <Profile /> : <Home />} />
          <Route path="/dashboard" element={user ? <Dashboard /> : <Home />} />
          <Route path="/messages" element={user ? <Messages /> : <Home />} />
          <Route path="/service/:id" element={<ServiceDetails />} />
          <Route path="/provider/:id" element={<ProviderProfile />} />
          <Route path="/book/:providerId" element={user ? <BookingPage /> : <Home />} />
        </Routes>
        
        {/* Enhanced Footer with Dark Mode Toggle */}
        <footer className="bg-gradient-to-r from-gray-900 to-gray-800 dark:from-gray-800 dark:to-gray-900 text-white py-16 mt-20 transition-all duration-300">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-4 gap-8 mb-8">
              <div className="col-span-2">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-2 rounded-lg">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold">SkillSwap AI</h3>
                </div>
                <p className="text-gray-300 dark:text-gray-400 mb-6 max-w-md">
                  The future of service matching is here. Connect with verified professionals 
                  using advanced AI technology and secure identity verification.
                </p>
                <div className="flex flex-wrap gap-2 mb-6">
                  <div className="bg-gray-800 dark:bg-gray-700 px-3 py-1 rounded-full text-sm">
                    🤖 AI-Powered
                  </div>
                  <div className="bg-gray-800 dark:bg-gray-700 px-3 py-1 rounded-full text-sm">
                    🎯 Smart Matching
                  </div>
                  <div className="bg-gray-800 dark:bg-gray-700 px-3 py-1 rounded-full text-sm">
                    🔒 ID Verified
                  </div>
                </div>
                
                {/* Theme Toggle */}
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-gray-300 dark:text-gray-400">Theme:</span>
                  <ThemeToggle />
                  <span className="text-sm text-gray-300 dark:text-gray-400">
                    Switch to {document.documentElement.classList.contains('dark') ? 'light' : 'dark'} mode
                  </span>
                </div>
              </div>
              
              <div>
                <h4 className="text-lg font-semibold mb-4">Platform</h4>
                <ul className="space-y-2 text-gray-300 dark:text-gray-400">
                  <li><a href="/find-services" className="hover:text-white dark:hover:text-gray-200 transition-colors">Find Services</a></li>
                  <li><a href="/become-provider" className="hover:text-white dark:hover:text-gray-200 transition-colors">Become a Provider</a></li>
                  <li><a href="/how-it-works" className="hover:text-white dark:hover:text-gray-200 transition-colors">How It Works</a></li>
                  <li><a href="/dashboard" className="hover:text-white dark:hover:text-gray-200 transition-colors">Dashboard</a></li>
                </ul>
              </div>
              
              <div>
                <h4 className="text-lg font-semibold mb-4">Support</h4>
                <ul className="space-y-2 text-gray-300 dark:text-gray-400">
                  <li><a href="#" className="hover:text-white dark:hover:text-gray-200 transition-colors">Help Center</a></li>
                  <li><a href="#" className="hover:text-white dark:hover:text-gray-200 transition-colors">Contact Us</a></li>
                  <li><a href="#" className="hover:text-white dark:hover:text-gray-200 transition-colors">Privacy Policy</a></li>
                  <li><a href="#" className="hover:text-white dark:hover:text-gray-200 transition-colors">Terms of Service</a></li>
                </ul>
              </div>
            </div>
            
            <div className="border-t border-gray-700 dark:border-gray-600 pt-8 flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-400 dark:text-gray-500 mb-4 md:mb-0">
                &copy; 2024 SkillSwap AI. All rights reserved. Secure & Verified Platform.
              </p>
              <div className="flex items-center space-x-4 text-gray-400 dark:text-gray-500">
                <span className="text-sm">Built with</span>
                <div className="flex items-center space-x-2">
                  <span className="text-blue-400">React</span>
                  <span>•</span>
                  <span className="text-purple-400">Supabase</span>
                  <span>•</span>
                  <span className="text-green-400">AI Technology</span>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;