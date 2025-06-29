import React from 'react';
import { motion } from 'framer-motion';
import { Brain, TrendingUp, Target, AlertCircle, MapPin, Clock } from 'lucide-react';

interface AIInsightsProps {
  insights: {
    intent?: {
      intent: string;
      confidence: number;
      category: string;
    };
    sentiment?: {
      sentiment: string;
      confidence: number;
      urgency: 'low' | 'medium' | 'high';
    };
    entities?: {
      entities: Array<{
        entity: string;
        label: string;
        confidence: number;
      }>;
      skills: string[];
      location?: string;
    };
    totalMatches: number;
    avgScore: number;
  };
}

export const AIInsights: React.FC<AIInsightsProps> = ({ insights }) => {
  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getUrgencyIcon = (urgency: string) => {
    switch (urgency) {
      case 'high': return <AlertCircle className="w-4 h-4" />;
      case 'medium': return <Clock className="w-4 h-4" />;
      case 'low': return <Target className="w-4 h-4" />;
      default: return <Target className="w-4 h-4" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 mb-8 border border-blue-200"
    >
      <div className="flex items-center mb-4">
        <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-2 rounded-lg mr-3">
          <Brain className="w-5 h-5 text-white" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">AI Analysis Results</h3>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Intent Analysis */}
        {insights.intent && (
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="flex items-center mb-2">
              <Target className="w-4 h-4 text-blue-500 mr-2" />
              <span className="text-sm font-medium text-gray-700">Intent</span>
            </div>
            <p className="text-lg font-semibold text-gray-900 capitalize">
              {insights.intent.category}
            </p>
            <p className="text-sm text-gray-600">
              {Math.round(insights.intent.confidence * 100)}% confidence
            </p>
          </div>
        )}

        {/* Urgency Analysis */}
        {insights.sentiment && (
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="flex items-center mb-2">
              {getUrgencyIcon(insights.sentiment.urgency)}
              <span className="text-sm font-medium text-gray-700 ml-2">Urgency</span>
            </div>
            <div className={`inline-flex items-center px-2 py-1 rounded-full text-sm font-medium ${getUrgencyColor(insights.sentiment.urgency)}`}>
              {insights.sentiment.urgency.toUpperCase()}
            </div>
            <p className="text-sm text-gray-600 mt-1">
              {Math.round(insights.sentiment.confidence * 100)}% confidence
            </p>
          </div>
        )}

        {/* Skills Detected */}
        {insights.entities && insights.entities.skills.length > 0 && (
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="flex items-center mb-2">
              <TrendingUp className="w-4 h-4 text-green-500 mr-2" />
              <span className="text-sm font-medium text-gray-700">Skills Detected</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {insights.entities.skills.slice(0, 3).map((skill, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                >
                  {skill}
                </span>
              ))}
              {insights.entities.skills.length > 3 && (
                <span className="text-xs text-gray-500">
                  +{insights.entities.skills.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Location */}
        {insights.entities?.location && (
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="flex items-center mb-2">
              <MapPin className="w-4 h-4 text-purple-500 mr-2" />
              <span className="text-sm font-medium text-gray-700">Location</span>
            </div>
            <p className="text-lg font-semibold text-gray-900">
              {insights.entities.location}
            </p>
          </div>
        )}

        {/* Match Quality */}
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center mb-2">
            <Brain className="w-4 h-4 text-indigo-500 mr-2" />
            <span className="text-sm font-medium text-gray-700">Match Quality</span>
          </div>
          <div className="flex items-center">
            <div className="flex-1 bg-gray-200 rounded-full h-2 mr-2">
              <div
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
                style={{ width: `${Math.round(insights.avgScore * 100)}%` }}
              ></div>
            </div>
            <span className="text-sm font-semibold text-gray-900">
              {Math.round(insights.avgScore * 100)}%
            </span>
          </div>
        </div>
      </div>

      {/* Additional Insights */}
      {insights.entities && insights.entities.entities.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Detected Entities:</h4>
          <div className="flex flex-wrap gap-2">
            {insights.entities.entities.slice(0, 5).map((entity, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                title={`${entity.label} - ${Math.round(entity.confidence * 100)}% confidence`}
              >
                {entity.entity} ({entity.label})
              </span>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
};