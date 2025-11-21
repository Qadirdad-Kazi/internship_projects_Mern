import React from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Play, Star, Clock, Users, Award, CheckCircle } from 'lucide-react';

const CourseDetail = () => {
  const { id } = useParams();

  // Mock course data
  const course = {
    id: 1,
    title: 'JavaScript Fundamentals',
    description: 'Master the fundamentals of JavaScript programming language from scratch. This comprehensive course covers everything you need to know to start your journey as a web developer.',
    price: 49.99,
    rating: 4.8,
    students: 1250,
    duration: '8 hours',
    level: 'Beginner',
    thumbnail: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=800',
    instructor: {
      name: 'John Doe',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
      bio: 'Senior JavaScript Developer with 8+ years of experience'
    },
    lessons: [
      { id: 1, title: 'Introduction to JavaScript', duration: '15 min', isPreview: true },
      { id: 2, title: 'Variables and Data Types', duration: '25 min', isPreview: true },
      { id: 3, title: 'Functions and Scope', duration: '30 min', isPreview: false },
      { id: 4, title: 'Objects and Arrays', duration: '35 min', isPreview: false }
    ],
    requirements: [
      'Basic computer knowledge',
      'Text editor (VS Code recommended)',
      'Web browser'
    ],
    whatYouWillLearn: [
      'JavaScript syntax and fundamentals',
      'Variables, functions, and objects',
      'DOM manipulation basics',
      'Modern ES6+ features'
    ]
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <img
                src={course.thumbnail}
                alt={course.title}
                className="w-full h-64 object-cover rounded-xl mb-6"
              />
              
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {course.title}
              </h1>
              
              <p className="text-lg text-gray-600 mb-6">
                {course.description}
              </p>
              
              {/* Course Stats */}
              <div className="flex flex-wrap gap-6 mb-8">
                <div className="flex items-center space-x-2">
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">{course.rating}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-gray-500" />
                  <span>{course.students} students</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="h-5 w-5 text-gray-500" />
                  <span>{course.duration}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Award className="h-5 w-5 text-gray-500" />
                  <span>{course.level}</span>
                </div>
              </div>
              
              {/* What You'll Learn */}
              <div className="bg-white rounded-xl p-6 mb-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  What you'll learn
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {course.whatYouWillLearn.map((item, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-700">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Course Content */}
              <div className="bg-white rounded-xl p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Course Content
                </h3>
                <div className="space-y-2">
                  {course.lessons.map((lesson, index) => (
                    <div
                      key={lesson.id}
                      className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50"
                    >
                      <div className="flex items-center space-x-3">
                        <Play className="h-4 w-4 text-blue-600" />
                        <span className="font-medium">{lesson.title}</span>
                        {lesson.isPreview && (
                          <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                            Preview
                          </span>
                        )}
                      </div>
                      <span className="text-sm text-gray-500">{lesson.duration}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
          
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white rounded-xl p-6 shadow-lg sticky top-8"
            >
              <div className="text-center mb-6">
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  ${course.price}
                </div>
                <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors mb-3">
                  Enroll Now
                </button>
                <p className="text-sm text-gray-500">30-day money-back guarantee</p>
              </div>
              
              {/* Instructor */}
              <div className="border-t pt-6">
                <h4 className="font-semibold text-gray-900 mb-3">Instructor</h4>
                <div className="flex items-center space-x-3 mb-3">
                  <img
                    src={course.instructor.avatar}
                    alt={course.instructor.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <div className="font-medium text-gray-900">
                      {course.instructor.name}
                    </div>
                    <div className="text-sm text-gray-600">
                      {course.instructor.bio}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Requirements */}
              <div className="border-t pt-6">
                <h4 className="font-semibold text-gray-900 mb-3">Requirements</h4>
                <ul className="space-y-2">
                  {course.requirements.map((req, index) => (
                    <li key={index} className="text-sm text-gray-600 flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;