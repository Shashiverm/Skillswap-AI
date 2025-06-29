import React from 'react';
import { motion } from 'framer-motion';
import { Search, Brain, MessageSquare, CheckCircle, Mic, Zap, Users, Star } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      icon: Search,
      title: 'Describe Your Need',
      description: 'Tell us what you need using voice or text. Our AI understands natural language and extracts key details.',
      details: ['Voice or text input', 'Natural language processing', 'Intent classification', 'Skill extraction']
    },
    {
      icon: Brain,
      title: 'AI Matching',
      description: 'Our advanced AI analyzes your request and matches you with the most suitable providers based on skills, availability, and location.',
      details: ['Semantic similarity matching', 'Real-time availability check', 'Location-based filtering', 'Skill compatibility scoring']
    },
    {
      icon: MessageSquare,
      title: 'Connect & Communicate',
      description: 'Review matched providers, check their profiles, and start conversations directly through our platform.',
      details: ['Provider profiles & portfolios', 'Direct messaging', 'Video calls', 'Project discussions']
    },
    {
      icon: CheckCircle,
      title: 'Get It Done',
      description: 'Work with your chosen provider, track progress, and complete your project with confidence.',
      details: ['Project milestones', 'Secure payments', 'Progress tracking', 'Quality assurance']
    }
  ];

  const features = [
    {
      icon: Mic,
      title: 'Voice-Powered Search',
      description: 'Simply speak your requirements and let our AI understand what you need'
    },
    {
      icon: Zap,
      title: 'Instant Matching',
      description: 'Get matched with qualified providers in seconds, not hours'
    },
    {
      icon: Users,
      title: 'Verified Providers',
      description: 'All providers are background-checked and skill-verified'
    },
    {
      icon: Star,
      title: 'Quality Guaranteed',
      description: 'Our AI ensures high-quality matches with satisfaction guarantee'
    }
  ];

  const aiCapabilities = [
    {
      title: 'Intent Classification',
      description: 'Understands what type of service you need from natural language',
      accuracy: '94%'
    },
    {
      title: 'Sentiment Analysis',
      description: 'Detects urgency levels and emotional context in your requests',
      accuracy: '91%'
    },
    {
      title: 'Entity Extraction',
      description: 'Identifies skills, locations, and specific requirements automatically',
      accuracy: '96%'
    },
    {
      title: 'Semantic Matching',
      description: 'Matches providers based on meaning, not just keywords',
      accuracy: '89%'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-purple-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl lg:text-6xl font-bold mb-6"
          >
            How SkillSwap AI Works
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl mb-8 max-w-3xl mx-auto"
          >
            Discover how our advanced AI technology revolutionizes the way you find and connect with service providers
          </motion.p>
        </div>
      </section>

      {/* Steps Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Simple 4-Step Process</h2>
            <p className="text-xl text-gray-600">From request to completion in minutes</p>
          </div>

          <div className="space-y-16">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                className={`flex flex-col lg:flex-row items-center gap-12 ${
                  index % 2 === 1 ? 'lg:flex-row-reverse' : ''
                }`}
              >
                <div className="flex-1">
                  <div className="flex items-center mb-6">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center mr-4">
                      <step.icon className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-blue-600 mb-1">STEP {index + 1}</div>
                      <h3 className="text-2xl font-bold text-gray-900">{step.title}</h3>
                    </div>
                  </div>
                  <p className="text-lg text-gray-600 mb-6">{step.description}</p>
                  <ul className="space-y-2">
                    {step.details.map((detail, detailIndex) => (
                      <li key={detailIndex} className="flex items-center text-gray-700">
                        <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                        {detail}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex-1">
                  <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8 border border-blue-200">
                    <div className="text-center">
                      <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <step.icon className="w-12 h-12 text-white" />
                      </div>
                      <h4 className="text-xl font-semibold text-gray-900 mb-2">{step.title}</h4>
                      <p className="text-gray-600">Interactive demo coming soon</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Capabilities Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Powered by Advanced AI</h2>
            <p className="text-xl text-gray-600">Our machine learning models ensure accurate matching</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {aiCapabilities.map((capability, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">{capability.title}</h3>
                  <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                    {capability.accuracy} accurate
                  </div>
                </div>
                <p className="text-gray-600">{capability.description}</p>
                <div className="mt-4">
                  <div className="bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
                      style={{ width: capability.accuracy }}
                    ></div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Key Features</h2>
            <p className="text-xl text-gray-600">Everything you need for successful service matching</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="text-center p-6 rounded-xl bg-gradient-to-br from-gray-50 to-white border border-gray-200"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl mb-4">
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-3xl font-bold text-white mb-6">Ready to Experience AI-Powered Matching?</h2>
            <p className="text-xl text-blue-100 mb-8">
              Join thousands of users who have found their perfect service providers
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white text-blue-600 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-gray-100 transition-colors shadow-lg"
            >
              Get Started Now
            </motion.button>
          </motion.div>
        </div>
      </section>
    </div>
  );
};