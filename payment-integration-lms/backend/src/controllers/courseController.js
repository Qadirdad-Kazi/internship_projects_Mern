import Course from '../models/Course.js';
import User from '../models/User.js';
import Payment from '../models/Payment.js';
import { asyncHandler, AppError } from '../middleware/error.js';
import { uploadToCloudinary, deleteFromCloudinary } from '../utils/upload.js';
import logger from '../utils/logger.js';

// @desc    Get all courses
// @route   GET /api/courses
// @access  Public
export const getCourses = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 12;
  const sort = req.query.sort || '-createdAt';
  const category = req.query.category;
  const level = req.query.level;
  const pricing = req.query.pricing;
  const minPrice = req.query.minPrice;
  const maxPrice = req.query.maxPrice;

  // Build query
  let query = { isPublished: true };

  if (category) query.category = category;
  if (level) query.level = level;
  if (pricing) query['pricing.type'] = pricing;
  
  if (minPrice || maxPrice) {
    query['pricing.amount'] = {};
    if (minPrice) query['pricing.amount'].$gte = Number(minPrice);
    if (maxPrice) query['pricing.amount'].$lte = Number(maxPrice);
  }

  const courses = await Course.find(query)
    .populate('instructor', 'name avatar')
    .select('-lessons') // Exclude lessons for performance
    .sort(sort)
    .limit(limit * 1)
    .skip((page - 1) * limit);

  const total = await Course.countDocuments(query);

  // Add user access information if authenticated
  const coursesWithAccess = courses.map(course => {
    const courseObj = course.toObject();
    courseObj.hasAccess = req.user ? course.isAccessibleTo(req.user) : false;
    return courseObj;
  });

  res.json({
    success: true,
    count: courses.length,
    total,
    pagination: {
      page,
      pages: Math.ceil(total / limit),
      limit
    },
    data: coursesWithAccess
  });
});

// @desc    Get single course
// @route   GET /api/courses/:id
// @access  Public
export const getCourseById = asyncHandler(async (req, res, next) => {
  const course = await Course.findById(req.params.id)
    .populate('instructor', 'name avatar')
    .populate('reviews.user', 'name avatar');

  if (!course || !course.isPublished) {
    return next(new AppError('Course not found', 404));
  }

  const courseObj = course.toObject();
  
  // Check user access
  const hasAccess = req.user ? course.isAccessibleTo(req.user) : false;
  courseObj.hasAccess = hasAccess;

  // If user doesn't have access, only show preview lessons
  if (!hasAccess) {
    courseObj.lessons = course.lessons.filter(lesson => lesson.isPreview);
  }

  res.json({
    success: true,
    data: courseObj
  });
});

// @desc    Create new course
// @route   POST /api/courses
// @access  Private (Instructor/Admin)
export const createCourse = asyncHandler(async (req, res, next) => {
  // Add instructor to req.body
  req.body.instructor = req.user._id;

  const course = await Course.create(req.body);

  res.status(201).json({
    success: true,
    message: 'Course created successfully',
    data: course
  });
});

// @desc    Update course
// @route   PUT /api/courses/:id
// @access  Private (Instructor/Admin)
export const updateCourse = asyncHandler(async (req, res, next) => {
  let course = await Course.findById(req.params.id);

  if (!course) {
    return next(new AppError('Course not found', 404));
  }

  // Check if user is the instructor or admin
  if (course.instructor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return next(new AppError('Not authorized to update this course', 403));
  }

  course = await Course.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.json({
    success: true,
    message: 'Course updated successfully',
    data: course
  });
});

// @desc    Delete course
// @route   DELETE /api/courses/:id
// @access  Private (Instructor/Admin)
export const deleteCourse = asyncHandler(async (req, res, next) => {
  const course = await Course.findById(req.params.id);

  if (!course) {
    return next(new AppError('Course not found', 404));
  }

  // Check if user is the instructor or admin
  if (course.instructor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return next(new AppError('Not authorized to delete this course', 403));
  }

  // Delete associated files from cloudinary if any
  if (course.thumbnail && course.thumbnail.public_id) {
    await deleteFromCloudinary(course.thumbnail.public_id);
  }

  await course.deleteOne();

  res.json({
    success: true,
    message: 'Course deleted successfully'
  });
});

// @desc    Purchase course
// @route   POST /api/courses/:id/purchase
// @access  Private
export const purchaseCourse = asyncHandler(async (req, res, next) => {
  const course = await Course.findById(req.params.id);

  if (!course || !course.isPublished) {
    return next(new AppError('Course not found', 404));
  }

  // Check if course is free
  if (course.pricing.type === 'free') {
    // Enroll user directly for free courses
    if (!req.user.ownsCourse(req.params.id)) {
      req.user.courses.push({
        course: req.params.id,
        purchaseDate: new Date(),
        amount: 0
      });
      await req.user.save();

      // Update course enrollment count
      await Course.findByIdAndUpdate(req.params.id, {
        $inc: { studentsEnrolled: 1 }
      });
    }

    return res.json({
      success: true,
      message: 'Successfully enrolled in free course',
      redirect: `/courses/${req.params.id}/learn`
    });
  }

  // Check if user already owns the course
  if (req.user.ownsCourse(req.params.id)) {
    return res.json({
      success: true,
      message: 'You already own this course',
      redirect: `/courses/${req.params.id}/learn`
    });
  }

  // Check if user has premium access for premium courses
  if (course.pricing.type === 'premium' && req.user.hasPremiumAccess()) {
    req.user.courses.push({
      course: req.params.id,
      purchaseDate: new Date(),
      amount: 0
    });
    await req.user.save();

    await Course.findByIdAndUpdate(req.params.id, {
      $inc: { studentsEnrolled: 1 }
    });

    return res.json({
      success: true,
      message: 'Course accessed with premium subscription',
      redirect: `/courses/${req.params.id}/learn`
    });
  }

  // For paid courses, return payment information
  res.json({
    success: true,
    message: 'Payment required',
    course: {
      id: course._id,
      title: course.title,
      price: course.effectivePrice,
      currency: course.pricing.currency,
      thumbnail: course.thumbnail
    },
    redirect: `/payment/course/${req.params.id}`
  });
});

// @desc    Get enrolled courses
// @route   GET /api/courses/enrolled/my
// @access  Private
export const getEnrolledCourses = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id)
    .populate({
      path: 'courses.course',
      select: 'title description thumbnail duration studentsEnrolled ratings instructor',
      populate: {
        path: 'instructor',
        select: 'name avatar'
      }
    });

  const enrolledCourses = user.courses.map(enrollment => ({
    ...enrollment.course.toObject(),
    enrollmentDate: enrollment.purchaseDate,
    amountPaid: enrollment.amount,
    progress: 0 // TODO: Calculate actual progress
  }));

  res.json({
    success: true,
    count: enrolledCourses.length,
    data: enrolledCourses
  });
});

// @desc    Add course review
// @route   POST /api/courses/:id/reviews
// @access  Private
export const addReview = asyncHandler(async (req, res, next) => {
  const { rating, comment } = req.body;
  const courseId = req.params.id;

  const course = await Course.findById(courseId);

  if (!course) {
    return next(new AppError('Course not found', 404));
  }

  // Check if user owns the course
  if (!req.user.ownsCourse(courseId)) {
    return next(new AppError('You must purchase this course to leave a review', 403));
  }

  // Check if user already reviewed
  const existingReview = course.reviews.find(
    review => review.user.toString() === req.user._id.toString()
  );

  if (existingReview) {
    return next(new AppError('You have already reviewed this course', 400));
  }

  // Add review
  course.reviews.push({
    user: req.user._id,
    rating: Number(rating),
    comment
  });

  // Update ratings
  course.updateRatings();

  await course.save();

  res.status(201).json({
    success: true,
    message: 'Review added successfully',
    data: course.reviews[course.reviews.length - 1]
  });
});

// @desc    Get course reviews
// @route   GET /api/courses/:id/reviews
// @access  Public
export const getReviews = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;

  const course = await Course.findById(req.params.id)
    .populate({
      path: 'reviews.user',
      select: 'name avatar'
    })
    .select('reviews ratings');

  if (!course) {
    return next(new AppError('Course not found', 404));
  }

  // Paginate reviews
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const paginatedReviews = course.reviews
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(startIndex, endIndex);

  res.json({
    success: true,
    count: paginatedReviews.length,
    total: course.reviews.length,
    pagination: {
      page,
      pages: Math.ceil(course.reviews.length / limit),
      limit
    },
    ratings: course.ratings,
    data: paginatedReviews
  });
});

// @desc    Update review
// @route   PUT /api/courses/reviews/:reviewId
// @access  Private
export const updateReview = asyncHandler(async (req, res, next) => {
  const { rating, comment } = req.body;

  const course = await Course.findOne({ 'reviews._id': req.params.reviewId });

  if (!course) {
    return next(new AppError('Review not found', 404));
  }

  const review = course.reviews.id(req.params.reviewId);

  // Check if user owns the review
  if (review.user.toString() !== req.user._id.toString()) {
    return next(new AppError('Not authorized to update this review', 403));
  }

  review.rating = rating || review.rating;
  review.comment = comment || review.comment;

  course.updateRatings();
  await course.save();

  res.json({
    success: true,
    message: 'Review updated successfully',
    data: review
  });
});

// @desc    Delete review
// @route   DELETE /api/courses/reviews/:reviewId
// @access  Private
export const deleteReview = asyncHandler(async (req, res, next) => {
  const course = await Course.findOne({ 'reviews._id': req.params.reviewId });

  if (!course) {
    return next(new AppError('Review not found', 404));
  }

  const review = course.reviews.id(req.params.reviewId);

  // Check if user owns the review or is admin
  if (review.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return next(new AppError('Not authorized to delete this review', 403));
  }

  course.reviews.pull({ _id: req.params.reviewId });
  course.updateRatings();
  await course.save();

  res.json({
    success: true,
    message: 'Review deleted successfully'
  });
});

// @desc    Search courses
// @route   GET /api/courses/search
// @access  Public
export const searchCourses = asyncHandler(async (req, res, next) => {
  const { q, category, level, minPrice, maxPrice } = req.query;
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 12;

  let query = { isPublished: true };

  // Text search
  if (q) {
    query.$text = { $search: q };
  }

  // Filters
  if (category) query.category = category;
  if (level) query.level = level;
  
  if (minPrice || maxPrice) {
    query['pricing.amount'] = {};
    if (minPrice) query['pricing.amount'].$gte = Number(minPrice);
    if (maxPrice) query['pricing.amount'].$lte = Number(maxPrice);
  }

  const courses = await Course.find(query)
    .populate('instructor', 'name avatar')
    .select('-lessons')
    .sort(q ? { score: { $meta: 'textScore' } } : '-createdAt')
    .limit(limit * 1)
    .skip((page - 1) * limit);

  const total = await Course.countDocuments(query);

  res.json({
    success: true,
    count: courses.length,
    total,
    pagination: {
      page,
      pages: Math.ceil(total / limit),
      limit
    },
    data: courses
  });
});

// @desc    Get featured courses
// @route   GET /api/courses/featured
// @access  Public
export const getFeaturedCourses = asyncHandler(async (req, res, next) => {
  const courses = await Course.find({
    isPublished: true,
    'ratings.average': { $gte: 4.0 }
  })
    .populate('instructor', 'name avatar')
    .select('-lessons')
    .sort('-studentsEnrolled -ratings.average')
    .limit(8);

  res.json({
    success: true,
    count: courses.length,
    data: courses
  });
});

// @desc    Get courses by category
// @route   GET /api/courses/category/:category
// @access  Public
export const getCoursesByCategory = asyncHandler(async (req, res, next) => {
  const { category } = req.params;
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 12;

  const courses = await Course.find({
    category,
    isPublished: true
  })
    .populate('instructor', 'name avatar')
    .select('-lessons')
    .sort('-createdAt')
    .limit(limit * 1)
    .skip((page - 1) * limit);

  const total = await Course.countDocuments({ category, isPublished: true });

  res.json({
    success: true,
    count: courses.length,
    total,
    pagination: {
      page,
      pages: Math.ceil(total / limit),
      limit
    },
    data: courses
  });
});

// @desc    Get instructor courses
// @route   GET /api/courses/instructor/my
// @access  Private (Instructor/Admin)
export const getInstructorCourses = asyncHandler(async (req, res, next) => {
  const courses = await Course.find({ instructor: req.user._id })
    .sort('-createdAt');

  res.json({
    success: true,
    count: courses.length,
    data: courses
  });
});