import User from '../models/User.js';
import Course from '../models/Course.js';
import Payment from '../models/Payment.js';
import { asyncHandler, AppError } from '../middleware/error.js';

// @desc    Get all users
// @route   GET /api/users
// @access  Private (Admin only)
export const getAllUsers = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 20;
  const role = req.query.role;
  const search = req.query.search;

  let query = {};
  
  if (role) query.role = role;
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } }
    ];
  }

  const users = await User.find(query)
    .select('-password')
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);

  const total = await User.countDocuments(query);

  res.json({
    success: true,
    count: users.length,
    total,
    pagination: {
      page,
      pages: Math.ceil(total / limit),
      limit
    },
    data: users
  });
});

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private (Admin only)
export const getUserById = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id)
    .populate('courses.course', 'title thumbnail pricing')
    .select('-password');

  if (!user) {
    return next(new AppError('User not found', 404));
  }

  // Get user's payment history
  const payments = await Payment.find({ user: user._id })
    .populate('course', 'title')
    .sort({ createdAt: -1 })
    .limit(10);

  res.json({
    success: true,
    data: {
      user,
      payments,
      stats: {
        totalCourses: user.courses.length,
        totalSpent: payments
          .filter(p => p.status === 'completed')
          .reduce((sum, p) => sum + p.amount.value, 0),
        joinedDate: user.createdAt,
        lastLogin: user.lastLogin
      }
    }
  });
});

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private (Admin only)
export const updateUser = asyncHandler(async (req, res, next) => {
  const fieldsToUpdate = {
    name: req.body.name,
    email: req.body.email,
    role: req.body.role,
    isVerified: req.body.isVerified
  };

  // Remove undefined fields
  Object.keys(fieldsToUpdate).forEach(key => 
    fieldsToUpdate[key] === undefined && delete fieldsToUpdate[key]
  );

  // Check if email is being changed and if it's already taken
  if (req.body.email) {
    const existingUser = await User.findOne({ 
      email: req.body.email,
      _id: { $ne: req.params.id }
    });
    
    if (existingUser) {
      return next(new AppError('Email is already in use', 400));
    }
  }

  const user = await User.findByIdAndUpdate(
    req.params.id,
    fieldsToUpdate,
    {
      new: true,
      runValidators: true
    }
  ).select('-password');

  if (!user) {
    return next(new AppError('User not found', 404));
  }

  res.json({
    success: true,
    message: 'User updated successfully',
    data: user
  });
});

// @desc    Update user role
// @route   PUT /api/users/:id/role
// @access  Private (Admin only)
export const updateUserRole = asyncHandler(async (req, res, next) => {
  const { role } = req.body;

  if (!['student', 'instructor', 'admin'].includes(role)) {
    return next(new AppError('Invalid role specified', 400));
  }

  const user = await User.findByIdAndUpdate(
    req.params.id,
    { role },
    { new: true, runValidators: true }
  ).select('-password');

  if (!user) {
    return next(new AppError('User not found', 404));
  }

  res.json({
    success: true,
    message: 'User role updated successfully',
    data: user
  });
});

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private (Admin only)
export const deleteUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new AppError('User not found', 404));
  }

  // Don't allow deleting other admins
  if (user.role === 'admin' && user._id.toString() !== req.user._id.toString()) {
    return next(new AppError('Cannot delete other admin users', 403));
  }

  // If user is an instructor, handle their courses
  if (user.role === 'instructor') {
    const courses = await Course.find({ instructor: user._id });
    
    if (courses.length > 0) {
      // You might want to transfer courses to another instructor or unpublish them
      await Course.updateMany(
        { instructor: user._id },
        { isPublished: false }
      );
    }
  }

  await user.deleteOne();

  res.json({
    success: true,
    message: 'User deleted successfully'
  });
});

// @desc    Get user statistics
// @route   GET /api/users/stats
// @access  Private (Admin only)
export const getUserStats = asyncHandler(async (req, res, next) => {
  // Total users by role
  const userStats = await User.aggregate([
    {
      $group: {
        _id: '$role',
        count: { $sum: 1 }
      }
    }
  ]);

  // Total users
  const totalUsers = await User.countDocuments();

  // Users registered in last 30 days
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const newUsersThisMonth = await User.countDocuments({
    createdAt: { $gte: thirtyDaysAgo }
  });

  // Subscription stats
  const subscriptionStats = await User.aggregate([
    {
      $group: {
        _id: '$subscription.type',
        count: { $sum: 1 }
      }
    }
  ]);

  // Active premium users
  const activePremiumUsers = await User.countDocuments({
    'subscription.type': { $in: ['basic', 'premium'] },
    'subscription.status': 'active',
    'subscription.endDate': { $gt: new Date() }
  });

  // User growth over last 12 months
  const userGrowth = await User.aggregate([
    {
      $match: {
        createdAt: {
          $gte: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000)
        }
      }
    },
    {
      $group: {
        _id: {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' }
        },
        count: { $sum: 1 }
      }
    },
    {
      $sort: { '_id.year': 1, '_id.month': 1 }
    }
  ]);

  res.json({
    success: true,
    data: {
      overview: {
        totalUsers,
        newUsersThisMonth,
        activePremiumUsers
      },
      usersByRole: userStats.reduce((acc, stat) => {
        acc[stat._id] = stat.count;
        return acc;
      }, {}),
      subscriptionBreakdown: subscriptionStats.reduce((acc, stat) => {
        acc[stat._id || 'free'] = stat.count;
        return acc;
      }, {}),
      growthData: userGrowth
    }
  });
});