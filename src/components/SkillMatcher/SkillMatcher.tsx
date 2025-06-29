import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, DollarSign, Star, Clock, MessageCircle, Brain, Zap, Target, TrendingUp } from 'lucide-react';
import { VoiceInput } from '../VoiceInput/VoiceInput';
import { aiService } from '../../lib/ai';
import { AIInsights } from './AIInsights';
import { ProviderCard } from './ProviderCard';
import { SearchFilters } from './SearchFilters';
import toast from 'react-hot-toast';

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

interface SearchFilters {
  category: string;
  priceRange: [number, number];
  availability: string;
  rating: number;
  location: string;
}

// Enhanced mock data with more diverse providers
const mockProviders: Provider[] = [
  {
    id: '1',
    name: 'Sarah Chen',
    title: 'Full-Stack Developer',
    rating: 4.9,
    reviews: 127,
    hourlyRate: 85,
    location: 'San Francisco, CA',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    skills: ['React', 'Node.js', 'Python', 'AWS', 'TypeScript', 'GraphQL'],
    availability: 'available',
    description: 'Experienced full-stack developer specializing in modern web applications, cloud infrastructure, and scalable backend systems. Expert in React ecosystem and serverless architectures.'
  },
  {
    id: '2',
    name: 'Mike Johnson',
    title: 'Master Plumber',
    rating: 4.8,
    reviews: 89,
    hourlyRate: 75,
    location: 'Austin, TX',
    avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    skills: ['Plumbing', 'Emergency Repairs', 'Installation', 'Pipe Fitting', 'Water Heaters'],
    availability: 'available',
    description: 'Licensed master plumber with 15+ years experience in residential and commercial plumbing. Available for emergency repairs and complex installations.'
  },
  {
    id: '3',
    name: 'Emily Rodriguez',
    title: 'UX/UI Designer',
    rating: 4.9,
    reviews: 156,
    hourlyRate: 65,
    location: 'Los Angeles, CA',
    avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    skills: ['UI/UX Design', 'Branding', 'Illustration', 'Adobe Creative', 'Figma', 'Prototyping'],
    availability: 'available',
    description: 'Creative UX/UI designer helping brands tell their story through compelling visual design and intuitive user experiences. Specializes in mobile-first design.'
  },
  {
    id: '4',
    name: 'David Kim',
    title: 'Personal Trainer',
    rating: 4.7,
    reviews: 73,
    hourlyRate: 55,
    location: 'Seattle, WA',
    avatar: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    skills: ['Fitness Training', 'Nutrition', 'Weight Loss', 'Strength Training', 'HIIT', 'Yoga'],
    availability: 'busy',
    description: 'Certified personal trainer and nutrition specialist focused on helping clients achieve sustainable fitness goals through personalized workout plans.'
  },
  {
    id: '5',
    name: 'Lisa Wang',
    title: 'Digital Marketing Expert',
    rating: 4.8,
    reviews: 94,
    hourlyRate: 70,
    location: 'New York, NY',
    avatar: 'https://images.pexels.com/photos/1181424/pexels-photo-1181424.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    skills: ['SEO', 'Social Media Marketing', 'Google Ads', 'Content Strategy', 'Analytics'],
    availability: 'available',
    description: 'Digital marketing strategist with proven track record of growing businesses through data-driven marketing campaigns and SEO optimization.'
  },
  {
    id: '6',
    name: 'Carlos Martinez',
    title: 'Electrician',
    rating: 4.6,
    reviews: 67,
    hourlyRate: 80,
    location: 'Phoenix, AZ',
    avatar: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    skills: ['Electrical Installation', 'Wiring', 'Panel Upgrades', 'Smart Home', 'Solar'],
    availability: 'available',
    description: 'Licensed electrician specializing in residential electrical work, smart home installations, and solar panel systems. Available for emergency calls.'
  }
];

export const SkillMatcher: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [providers, setProviders] = useState<Provider[]>(mockProviders);
  const [filteredProviders, setFilteredProviders] = useState<Provider[]>(mockProviders);
  const [aiInitialized, setAiInitialized] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiInsights, setAiInsights] = useState<any>(null);
  const [filters, setFilters] = useState<SearchFilters>({
    category: 'all',
    priceRange: [0, 200],
    availability: 'all',
    rating: 0,
    location: ''
  });

  useEffect(() => {
    const initAI = async () => {
      const { success } = await aiService.initialize();
      setAiInitialized(success);
      if (success) {
        toast.success('AI matching system ready!');
      }
    };
    initAI();
  }, []);

  const handleVoiceTranscript = (transcript: string) => {
    setSearchQuery(transcript);
    handleSearch(transcript);
  };

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setFilteredProviders(mockProviders);
      setAiInsights(null);
      return;
    }

    setIsAnalyzing(true);

    try {
      if (aiInitialized) {
        // Use AI-powered intelligent matching
        const intelligentResults = await aiService.intelligentMatch(query, mockProviders);
        
        // Get AI insights
        const [intent, sentiment, entities] = await Promise.all([
          aiService.classifyIntent(query),
          aiService.analyzeSentiment(query),
          aiService.extractEntities(query)
        ]);

        setAiInsights({
          intent,
          sentiment,
          entities,
          totalMatches: intelligentResults.length,
          avgScore: intelligentResults.reduce((sum, p) => sum + (p.aiScore || 0), 0) / intelligentResults.length
        });

        setFilteredProviders(intelligentResults);
        
        if (sentiment?.urgency === 'high') {
          toast.success('Found providers available for urgent requests!');
        }
      } else {
        // Fallback to simple keyword matching
        const filtered = mockProviders.filter(provider => 
          provider.skills.some(skill => 
            skill.toLowerCase().includes(query.toLowerCase())
          ) ||
          provider.title.toLowerCase().includes(query.toLowerCase()) ||
          provider.description.toLowerCase().includes(query.toLowerCase())
        );

        const scored = filtered.map(provider => ({
          ...provider,
          aiScore: calculateSimpleRelevanceScore(provider, query),
          matchReasons: getSimpleMatchReasons(provider, query)
        })).sort((a, b) => (b.aiScore || 0) - (a.aiScore || 0));

        setFilteredProviders(scored);
      }
    } catch (error) {
      console.error('Search failed:', error);
      toast.error('Search failed. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const calculateSimpleRelevanceScore = (provider: Provider, query: string): number => {
    let score = 0;
    const queryLower = query.toLowerCase();
    
    provider.skills.forEach(skill => {
      if (skill.toLowerCase().includes(queryLower)) score += 3;
    });
    
    if (provider.title.toLowerCase().includes(queryLower)) score += 2;
    if (provider.description.toLowerCase().includes(queryLower)) score += 1;
    if (provider.availability === 'available') score += 1;
    score += provider.rating * 0.5;
    
    return Math.min(score / 10, 1);
  };

  const getSimpleMatchReasons = (provider: Provider, query: string): string[] => {
    const reasons: string[] = [];
    const queryLower = query.toLowerCase();
    
    const matchingSkills = provider.skills.filter(skill => 
      skill.toLowerCase().includes(queryLower)
    );
    
    if (matchingSkills.length > 0) {
      reasons.push(`Matches ${matchingSkills.length} skills`);
    }
    
    if (provider.availability === 'available') {
      reasons.push('Available now');
    }
    
    if (provider.rating >= 4.5) {
      reasons.push('Highly rated');
    }
    
    return reasons;
  };

  const applyFilters = (providers: Provider[]): Provider[] => {
    return providers.filter(provider => {
      if (filters.category !== 'all') {
        const categoryMatch = provider.skills.some(skill => 
          skill.toLowerCase().includes(filters.category.toLowerCase())
        ) || provider.title.toLowerCase().includes(filters.category.toLowerCase());
        if (!categoryMatch) return false;
      }
      
      if (provider.hourlyRate < filters.priceRange[0] || provider.hourlyRate > filters.priceRange[1]) {
        return false;
      }
      
      if (filters.availability !== 'all' && provider.availability !== filters.availability) {
        return false;
      }
      
      if (provider.rating < filters.rating) {
        return false;
      }
      
      if (filters.location && !provider.location.toLowerCase().includes(filters.location.toLowerCase())) {
        return false;
      }
      
      return true;
    });
  };

  const displayProviders = applyFilters(filteredProviders);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-300">
      {/* Header */}
      <div className="text-center mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-center mb-4"
        >
          <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-3 rounded-full mr-3">
            <Brain className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white transition-colors duration-300">
            AI-Powered Service Matching
          </h2>
        </motion.div>
        <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-2xl mx-auto transition-colors duration-300">
          Describe what you need using voice or text, and our advanced AI will find the perfect service providers for you
        </p>
        
        {/* AI Status Indicator */}
        <div className="flex justify-center mb-6">
          <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${
            aiInitialized 
              ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' 
              : 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200'
          } transition-colors duration-300`}>
            <div className={`w-2 h-2 rounded-full mr-2 ${
              aiInitialized ? 'bg-green-500' : 'bg-yellow-500'
            }`}></div>
            {aiInitialized ? 'AI Matching Ready' : 'Loading AI Models...'}
          </div>
        </div>
      </div>

      {/* Search Interface */}
      <div className="mb-8 space-y-6">
        {/* Text Search */}
        <div className="relative">
          <Search className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="What service do you need? (e.g., 'urgent plumber needed', 'React developer for e-commerce site')"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              handleSearch(e.target.value);
            }}
            className="w-full pl-12 pr-16 py-4 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg shadow-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-colors duration-300"
          />
          {isAnalyzing && (
            <div className="absolute right-4 top-4">
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
                <span className="text-sm text-blue-600 dark:text-blue-400 font-medium">AI Analyzing...</span>
              </div>
            </div>
          )}
        </div>

        {/* Voice Input */}
        <VoiceInput onTranscript={handleVoiceTranscript} />
      </div>

      {/* AI Insights */}
      <AnimatePresence>
        {aiInsights && (
          <AIInsights insights={aiInsights} />
        )}
      </AnimatePresence>

      {/* Search Filters */}
      <SearchFilters filters={filters} onFiltersChange={setFilters} />

      {/* Results Header */}
      {searchQuery && (
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white transition-colors duration-300">
              {displayProviders.length} providers found
              {aiInsights && (
                <span className="text-sm font-normal text-gray-600 dark:text-gray-400 ml-2">
                  • AI confidence: {Math.round((aiInsights.avgScore || 0) * 100)}%
                </span>
              )}
            </h3>
            {aiInitialized && (
              <div className="flex items-center text-sm text-blue-600 dark:text-blue-400">
                <Zap className="w-4 h-4 mr-1" />
                AI-powered ranking
              </div>
            )}
          </div>
        </div>
      )}

      {/* Results Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence>
          {displayProviders.map((provider, index) => (
            <ProviderCard
              key={provider.id}
              provider={provider}
              index={index}
              showAIScore={aiInitialized}
            />
          ))}
        </AnimatePresence>
      </div>

      {/* No Results */}
      {displayProviders.length === 0 && searchQuery && !isAnalyzing && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <div className="text-gray-400 dark:text-gray-500 mb-4">
            <Search className="w-16 h-16 mx-auto" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 transition-colors duration-300">No providers found</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4 transition-colors duration-300">
            Try adjusting your search terms or filters, or check back later for new providers.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setFilteredProviders(mockProviders);
              setAiInsights(null);
            }}
            className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors duration-300"
          >
            Clear search and show all providers
          </button>
        </motion.div>
      )}
    </div>
  );
};