import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { asyncHandler, AppError } from './error.js';

// Protect routes - require authentication
export const protect = asyncHandler(async (req, res, next) => {
  let token;

  // Check for token in headers
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  // Check for token in cookies
  if (!token && req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return next(new AppError('Not authorized to access this route', 401));
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get user from token
    const user = await User.findById(decoded.id).select('+password');

    if (!user) {
      return next(new AppError('No user found with this token', 401));
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save({ validateBeforeSave: false });

    req.user = user;
    next();
  } catch (error) {
    return next(new AppError('Not authorized to access this route', 401));
  }
});

// Authorize specific roles
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError(`User role ${req.user.role} is not authorized to access this route`, 403));
    }
    next();
  };
};

// Premium subscription middleware
export const requirePremium = asyncHandler(async (req, res, next) => {
  if (!req.user.hasPremiumAccess()) {
    return next(new AppError('Premium subscription required to access this content', 403));
  }
  next();
});

// Course ownership middleware
export const requireCourseAccess = asyncHandler(async (req, res, next) => {
  const courseId = req.params.courseId || req.params.id;
  
  // Check if user owns the course or has premium access
  if (!req.user.ownsCourse(courseId) && !req.user.hasPremiumAccess()) {
    return next(new AppError('You do not have access to this course', 403));
  }
  
  next();
});

// Optional authentication - doesn't fail if no token
export const optionalAuth = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id);
      
      if (user) {
        req.user = user;
      }
    } catch (error) {
      // Token invalid, but that's okay for optional auth
    }
  }

  next();
});

// Verify user ownership of resource
export const verifyOwnership = (Model, paramName = 'id') => {
  return asyncHandler(async (req, res, next) => {
    const resourceId = req.params[paramName];
    const resource = await Model.findById(resourceId);

    if (!resource) {
      return next(new AppError('Resource not found', 404));
    }

    // Check if user owns the resource (for user-specific resources)
    if (resource.user && resource.user.toString() !== req.user._id.toString()) {
      return next(new AppError('Not authorized to access this resource', 403));
    }

    // For courses, check if user is the instructor
    if (resource.instructor && resource.instructor.toString() !== req.user._id.toString()) {
      return next(new AppError('Not authorized to modify this course', 403));
    }

    req.resource = resource;
    next();
  });
};

// Email verification middleware
export const requireVerification = (req, res, next) => {
  if (!req.user.isVerified) {
    return next(new AppError('Please verify your email to access this feature', 403));
  }
  next();
};