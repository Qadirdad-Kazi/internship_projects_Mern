import React from 'react';
import { motion } from 'framer-motion';
import { 
  BookOpen, 
  Award, 
  Clock, 
  TrendingUp,
  Crown,
  PlayCircle,
  Calendar,
  Target
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { user, hasPremiumAccess } = useAuthStore();

  const stats = [
    {
      title: 'Enrolled Courses',
      value: user?.courses?.length || 0,
      icon: BookOpen,
      color: 'from-blue-500 to-blue-600'
    },
    {
      title: 'Certificates Earned',
      value: '2',
      icon: Award,
      color: 'from-yellow-500 to-orange-500'
    },
    {
      title: 'Hours Learned',
      value: '45',
      icon: Clock,
      color: 'from-green-500 to-green-600'
    },
    {
      title: 'Learning Streak',
      value: '7 days',
      icon: TrendingUp,
      color: 'from-purple-500 to-purple-600'
    }
  ];

  const recentCourses = [
    {
      id: 1,
      title: 'JavaScript Fundamentals',
      progress: 75,
      thumbnail: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=300',
      instructor: 'John Doe',
      nextLesson: 'Functions and Scope'
    },
    {
      id: 2,
      title: 'React Advanced Patterns',
      progress: 45,
      thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=300',
      instructor: 'Jane Smith',
      nextLesson: 'Higher-Order Components'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2">
                  Welcome back, {user?.name}! 👋
                </h1>
                <p className="text-blue-100 text-lg">
                  {hasPremiumAccess() 
                    ? 'Premium member - You have unlimited access to all courses!' 
                    : 'Continue your learning journey today'}
                </p>
              </div>
              {hasPremiumAccess() && (
                <div className="bg-gradient-to-r from-yellow-400 to-orange-500 px-4 py-2 rounded-full flex items-center space-x-2">
                  <Crown className="h-5 w-5" />
                  <span className="font-semibold">Premium</span>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.title}
                className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="flex items-center">
                  <div className={`bg-gradient-to-r ${stat.color} p-3 rounded-lg`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Continue Learning */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-2"
          >
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Continue Learning</h2>
                <Link
                  to="/courses"
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  View All
                </Link>
              </div>
              
              <div className="space-y-4">
                {recentCourses.map((course) => (
                  <div
                    key={course.id}
                    className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors"
                  >
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">{course.title}</h3>
                      <p className="text-sm text-gray-600 mb-2">by {course.instructor}</p>
                      <div className="flex items-center space-x-4">
                        <div className="flex-1">
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-600">Progress</span>
                            <span className="font-medium">{course.progress}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full"
                              style={{ width: `${course.progress}%` }}
                            ></div>
                          </div>
                        </div>
                        <Link
                          to={`/courses/${course.id}/learn`}
                          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                        >
                          <PlayCircle className="h-4 w-4" />
                          <span>Continue</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="space-y-6"
          >
            {/* Subscription Status */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Subscription</h3>
              {hasPremiumAccess() ? (
                <div className="text-center">
                  <div className="bg-gradient-to-r from-yellow-400 to-orange-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Crown className="h-8 w-8 text-white" />
                  </div>
                  <p className="font-semibold text-gray-900 mb-2">Premium Active</p>
                  <p className="text-sm text-gray-600 mb-4">Unlimited access to all courses</p>
                  <Link
                    to="/subscription"
                    className="text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Manage Subscription
                  </Link>
                </div>
              ) : (
                <div className="text-center">
                  <div className="bg-gray-200 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Target className="h-8 w-8 text-gray-500" />
                  </div>
                  <p className="font-semibold text-gray-900 mb-2">Free Plan</p>
                  <p className="text-sm text-gray-600 mb-4">Upgrade to access premium content</p>
                  <Link
                    to="/subscription"
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-colors inline-block"
                  >
                    Upgrade Now
                  </Link>
                </div>
              )}
            </div>

            {/* Quick Links */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Link
                  to="/courses"
                  className="block w-full text-left p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <BookOpen className="h-5 w-5 text-blue-600" />
                    <span className="font-medium">Browse Courses</span>
                  </div>
                </Link>
                
                <Link
                  to="/profile"
                  className="block w-full text-left p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-5 w-5 text-blue-600" />
                    <span className="font-medium">Update Profile</span>
                  </div>
                </Link>
                
                {user?.role === 'instructor' && (
                  <Link
                    to="/instructor"
                    className="block w-full text-left p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <Award className="h-5 w-5 text-blue-600" />
                      <span className="font-medium">Instructor Dashboard</span>
                    </div>
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;