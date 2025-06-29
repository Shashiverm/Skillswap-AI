import React from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Users, DollarSign, Star, TrendingUp, Calendar, MessageSquare, Bell } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const stats = [
    { label: 'Total Earnings', value: '$12,450', change: '+12%', icon: DollarSign, color: 'text-green-600' },
    { label: 'Active Projects', value: '8', change: '+3', icon: BarChart3, color: 'text-blue-600' },
    { label: 'Client Rating', value: '4.9', change: '+0.2', icon: Star, color: 'text-yellow-600' },
    { label: 'Response Rate', value: '98%', change: '+5%', icon: TrendingUp, color: 'text-purple-600' }
  ];

  const recentActivity = [
    { type: 'match', message: 'New client match for React development', time: '2 hours ago' },
    { type: 'message', message: 'Message from Sarah Johnson', time: '4 hours ago' },
    { type: 'payment', message: 'Payment received: $2,500', time: '1 day ago' },
    { type: 'review', message: 'New 5-star review from TechStart Inc.', time: '2 days ago' }
  ];

  const upcomingMeetings = [
    { client: 'TechStart Inc.', project: 'E-commerce Platform', time: 'Today, 2:00 PM' },
    { client: 'Creative Agency', project: 'Mobile App Design', time: 'Tomorrow, 10:00 AM' },
    { client: 'DataCorp', project: 'Database Optimization', time: 'Friday, 3:00 PM' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Welcome back! Here's what's happening with your services.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-2 rounded-lg bg-gray-100`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <span className="text-sm font-medium text-green-600">{stat.change}</span>
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Recent Activity</h2>
              <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                View All
              </button>
            </div>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className={`p-2 rounded-full ${
                    activity.type === 'match' ? 'bg-blue-100' :
                    activity.type === 'message' ? 'bg-green-100' :
                    activity.type === 'payment' ? 'bg-yellow-100' :
                    'bg-purple-100'
                  }`}>
                    {activity.type === 'match' && <Users className="w-4 h-4 text-blue-600" />}
                    {activity.type === 'message' && <MessageSquare className="w-4 h-4 text-green-600" />}
                    {activity.type === 'payment' && <DollarSign className="w-4 h-4 text-yellow-600" />}
                    {activity.type === 'review' && <Star className="w-4 h-4 text-purple-600" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-900">{activity.message}</p>
                    <p className="text-sm text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Upcoming Meetings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Upcoming</h2>
              <Calendar className="w-5 h-5 text-gray-400" />
            </div>
            <div className="space-y-4">
              {upcomingMeetings.map((meeting, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-3">
                  <h3 className="font-semibold text-gray-900">{meeting.client}</h3>
                  <p className="text-sm text-gray-600">{meeting.project}</p>
                  <p className="text-sm text-blue-600 mt-1">{meeting.time}</p>
                </div>
              ))}
            </div>
            <button className="w-full mt-4 text-blue-600 hover:text-blue-700 text-sm font-medium">
              View Calendar
            </button>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
          <div className="grid md:grid-cols-4 gap-4">
            <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-center">
              <MessageSquare className="w-6 h-6 text-blue-600 mx-auto mb-2" />
              <span className="text-sm font-medium text-gray-900">Messages</span>
            </button>
            <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-center">
              <Calendar className="w-6 h-6 text-green-600 mx-auto mb-2" />
              <span className="text-sm font-medium text-gray-900">Schedule</span>
            </button>
            <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-center">
              <DollarSign className="w-6 h-6 text-yellow-600 mx-auto mb-2" />
              <span className="text-sm font-medium text-gray-900">Payments</span>
            </button>
            <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-center">
              <Bell className="w-6 h-6 text-purple-600 mx-auto mb-2" />
              <span className="text-sm font-medium text-gray-900">Notifications</span>
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};