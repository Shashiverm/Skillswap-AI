import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Clock, DollarSign, MessageSquare, CheckCircle, CreditCard } from 'lucide-react';

export const BookingPage: React.FC = () => {
  const { providerId } = useParams();
  const [selectedService, setSelectedService] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [projectDetails, setProjectDetails] = useState('');
  const [budget, setBudget] = useState('');

  const provider = {
    name: 'Sarah Chen',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
    title: 'Full-Stack Developer',
    rating: 4.9,
    hourlyRate: 85
  };

  const services = [
    { id: 'web-dev', name: 'Web Development', price: 85, duration: '1-2 weeks' },
    { id: 'ecommerce', name: 'E-commerce Solution', price: 95, duration: '2-4 weeks' },
    { id: 'ui-design', name: 'UI/UX Design', price: 65, duration: '1-2 weeks' }
  ];

  const availableDates = [
    '2024-01-15', '2024-01-16', '2024-01-17', '2024-01-18', '2024-01-19'
  ];

  const availableTimes = [
    '09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM', '04:00 PM'
  ];

  const handleBooking = () => {
    // Handle booking logic here
    console.log('Booking submitted:', {
      service: selectedService,
      date: selectedDate,
      time: selectedTime,
      details: projectDetails,
      budget
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
            <div className="flex items-center space-x-4">
              <img
                src={provider.avatar}
                alt={provider.name}
                className="w-16 h-16 rounded-full object-cover border-2 border-white"
              />
              <div>
                <h1 className="text-2xl font-bold">Book a Session with {provider.name}</h1>
                <p className="text-blue-100">{provider.title} • ${provider.hourlyRate}/hour</p>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-8">
            {/* Service Selection */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Service</h3>
              <div className="grid md:grid-cols-3 gap-4">
                {services.map((service) => (
                  <motion.div
                    key={service.id}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => setSelectedService(service.id)}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      selectedService === service.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <h4 className="font-semibold text-gray-900">{service.name}</h4>
                    <p className="text-sm text-gray-600 mb-2">{service.duration}</p>
                    <div className="text-lg font-bold text-blue-600">${service.price}/hour</div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Date Selection */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Choose Date</h3>
              <div className="grid grid-cols-5 gap-3">
                {availableDates.map((date) => (
                  <motion.button
                    key={date}
                    whileHover={{ scale: 1.05 }}
                    onClick={() => setSelectedDate(date)}
                    className={`p-3 border rounded-lg text-center transition-all ${
                      selectedDate === date
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-sm font-medium">
                      {new Date(date).toLocaleDateString('en-US', { 
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Time Selection */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Choose Time</h3>
              <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                {availableTimes.map((time) => (
                  <motion.button
                    key={time}
                    whileHover={{ scale: 1.05 }}
                    onClick={() => setSelectedTime(time)}
                    className={`p-3 border rounded-lg text-center transition-all ${
                      selectedTime === time
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-sm font-medium">{time}</div>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Project Details */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Project Details</h3>
              <textarea
                value={projectDetails}
                onChange={(e) => setProjectDetails(e.target.value)}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Describe your project requirements, goals, and any specific details..."
              />
            </div>

            {/* Budget */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Estimated Budget</h3>
              <div className="relative">
                <DollarSign className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="number"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your budget range"
                />
              </div>
            </div>

            {/* Booking Summary */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Booking Summary</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Service:</span>
                  <span className="font-medium">
                    {selectedService ? services.find(s => s.id === selectedService)?.name : 'Not selected'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Date & Time:</span>
                  <span className="font-medium">
                    {selectedDate && selectedTime 
                      ? `${new Date(selectedDate).toLocaleDateString()} at ${selectedTime}`
                      : 'Not selected'
                    }
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Hourly Rate:</span>
                  <span className="font-medium">${provider.hourlyRate}/hour</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Estimated Budget:</span>
                  <span className="font-medium">${budget || '0'}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleBooking}
                disabled={!selectedService || !selectedDate || !selectedTime}
                className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
              >
                <CreditCard className="w-5 h-5 mr-2" />
                Book & Pay
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-6 py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center"
              >
                <MessageSquare className="w-5 h-5 mr-2" />
                Message First
              </motion.button>
            </div>

            {/* Trust Indicators */}
            <div className="border-t border-gray-200 pt-6">
              <div className="grid md:grid-cols-3 gap-4 text-center">
                <div className="flex items-center justify-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-sm text-gray-600">Secure Payment</span>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-sm text-gray-600">Money Back Guarantee</span>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-sm text-gray-600">24/7 Support</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};