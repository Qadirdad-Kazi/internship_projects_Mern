import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Course from '../models/Course.js';
import Payment from '../models/Payment.js';
import { connectDB } from '../config/database.js';
import logger from './logger.js';

// Load env vars
dotenv.config();

// Sample data
const users = [
  {
    name: 'Admin User',
    email: 'admin@paymentlms.com',
    password: 'admin123',
    role: 'admin',
    isVerified: true
  },
  {
    name: 'John Instructor',
    email: 'instructor@paymentlms.com',
    password: 'instructor123',
    role: 'instructor',
    isVerified: true
  },
  {
    name: 'Jane Student',
    email: 'student@paymentlms.com',
    password: 'student123',
    role: 'student',
    isVerified: true,
    subscription: {
      type: 'premium',
      status: 'active',
      startDate: new Date(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      paymentMethod: 'stripe'
    }
  }
];

const courses = [
  {
    title: 'JavaScript Fundamentals',
    description: 'Learn the basics of JavaScript programming language from scratch.',
    shortDescription: 'Complete JavaScript course for beginners',
    category: 'Programming',
    level: 'Beginner',
    pricing: {
      type: 'free',
      amount: 0,
      currency: 'USD'
    },
    lessons: [
      {
        title: 'Introduction to JavaScript',
        description: 'What is JavaScript and why learn it?',
        content: 'JavaScript is a programming language...',
        duration: 15,
        isPreview: true,
        order: 1
      },
      {
        title: 'Variables and Data Types',
        description: 'Learn about variables and different data types',
        content: 'Variables in JavaScript...',
        duration: 20,
        isPreview: true,
        order: 2
      },
      {
        title: 'Functions in JavaScript',
        description: 'Understanding functions and their usage',
        content: 'Functions are reusable blocks...',
        duration: 25,
        isPreview: false,
        order: 3
      }
    ],
    requirements: ['Basic computer knowledge', 'Text editor'],
    whatYouWillLearn: [
      'JavaScript syntax and fundamentals',
      'Variables and data types',
      'Functions and scope',
      'DOM manipulation'
    ],
    tags: ['javascript', 'programming', 'web development'],
    isPublished: true,
    publishedAt: new Date()
  },
  {
    title: 'React Advanced Patterns',
    description: 'Master advanced React patterns and best practices for scalable applications.',
    shortDescription: 'Advanced React development techniques',
    category: 'Web Development',
    level: 'Advanced',
    pricing: {
      type: 'paid',
      amount: 49.99,
      currency: 'USD'
    },
    lessons: [
      {
        title: 'Higher-Order Components',
        description: 'Understanding and implementing HOCs',
        content: 'Higher-Order Components are...',
        duration: 30,
        isPreview: true,
        order: 1
      },
      {
        title: 'Render Props Pattern',
        description: 'Implementing render props for code reusability',
        content: 'Render props is a technique...',
        duration: 35,
        isPreview: false,
        order: 2
      },
      {
        title: 'Custom Hooks',
        description: 'Building reusable custom hooks',
        content: 'Custom hooks allow you to...',
        duration: 40,
        isPreview: false,
        order: 3
      }
    ],
    requirements: ['React fundamentals', 'JavaScript ES6+'],
    whatYouWillLearn: [
      'Advanced React patterns',
      'Performance optimization',
      'Custom hooks development',
      'State management patterns'
    ],
    tags: ['react', 'javascript', 'advanced', 'patterns'],
    isPublished: true,
    publishedAt: new Date()
  },
  {
    title: 'Machine Learning with Python',
    description: 'Comprehensive course on machine learning algorithms and implementation.',
    shortDescription: 'Complete ML course with Python',
    category: 'Machine Learning',
    level: 'Intermediate',
    pricing: {
      type: 'premium',
      amount: 99.99,
      currency: 'USD'
    },
    lessons: [
      {
        title: 'Introduction to Machine Learning',
        description: 'Overview of ML concepts and types',
        content: 'Machine Learning is...',
        duration: 45,
        isPreview: true,
        order: 1
      },
      {
        title: 'Linear Regression',
        description: 'Understanding and implementing linear regression',
        content: 'Linear regression is...',
        duration: 60,
        isPreview: false,
        order: 2
      }
    ],
    requirements: ['Python basics', 'Mathematics fundamentals'],
    whatYouWillLearn: [
      'ML algorithms',
      'Python libraries (scikit-learn, pandas)',
      'Data preprocessing',
      'Model evaluation'
    ],
    tags: ['machine learning', 'python', 'data science'],
    isPublished: true,
    publishedAt: new Date()
  }
];

// Import data
const importData = async () => {
  try {
    await connectDB();

    // Clear existing data
    await User.deleteMany();
    await Course.deleteMany();
    await Payment.deleteMany();

    // Insert users
    const createdUsers = await User.create(users);
    logger.info('Users imported successfully');

    // Add instructor to courses
    const instructor = createdUsers.find(user => user.role === 'instructor');
    const coursesWithInstructor = courses.map(course => ({
      ...course,
      instructor: instructor._id
    }));

    // Insert courses
    const createdCourses = await Course.create(coursesWithInstructor);
    logger.info('Courses imported successfully');

    // Add some sample enrollments for the student
    const student = createdUsers.find(user => user.role === 'student');
    const freeCourse = createdCourses.find(course => course.pricing.type === 'free');
    
    if (student && freeCourse) {
      student.courses.push({
        course: freeCourse._id,
        purchaseDate: new Date(),
        amount: 0
      });
      await student.save();
      
      // Update course enrollment count
      freeCourse.studentsEnrolled = 1;
      await freeCourse.save();
    }

    logger.info('Sample data imported successfully!');
    process.exit(0);
  } catch (error) {
    logger.error('Error importing data:', error);
    process.exit(1);
  }
};

// Delete data
const deleteData = async () => {
  try {
    await connectDB();

    await User.deleteMany();
    await Course.deleteMany();
    await Payment.deleteMany();

    logger.info('Data destroyed successfully!');
    process.exit(0);
  } catch (error) {
    logger.error('Error destroying data:', error);
    process.exit(1);
  }
};

// Run functions based on command line arguments
if (process.argv[2] === '-i') {
  importData();
} else if (process.argv[2] === '-d') {
  deleteData();
} else {
  logger.info('Usage:');
  logger.info('Import data: npm run seed -i');
  logger.info('Delete data: npm run seed -d');
  process.exit(0);
}