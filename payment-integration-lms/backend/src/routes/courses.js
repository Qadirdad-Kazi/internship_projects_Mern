import express from 'express';
import { protect, authorize, optionalAuth, requireCourseAccess } from '../middleware/auth.js';
import {
  getCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  purchaseCourse,
  getEnrolledCourses,
  addReview,
  getReviews,
  updateReview,
  deleteReview,
  searchCourses,
  getFeaturedCourses,
  getCoursesByCategory,
  getInstructorCourses
} from '../controllers/courseController.js';

const router = express.Router();

// Public routes
router.get('/', optionalAuth, getCourses);
router.get('/search', optionalAuth, searchCourses);
router.get('/featured', getFeaturedCourses);
router.get('/category/:category', optionalAuth, getCoursesByCategory);
router.get('/:id', optionalAuth, getCourseById);
router.get('/:id/reviews', getReviews);

// Protected routes
router.use(protect); // All routes below require authentication

// Student routes
router.post('/:id/purchase', purchaseCourse);
router.get('/enrolled/my', getEnrolledCourses);
router.post('/:id/reviews', addReview);
router.put('/reviews/:reviewId', updateReview);
router.delete('/reviews/:reviewId', deleteReview);

// Instructor routes
router.get('/instructor/my', authorize('instructor', 'admin'), getInstructorCourses);
router.post('/', authorize('instructor', 'admin'), createCourse);
router.put('/:id', authorize('instructor', 'admin'), updateCourse);
router.delete('/:id', authorize('instructor', 'admin'), deleteCourse);

export default router;