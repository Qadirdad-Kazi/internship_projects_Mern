import User from '../models/User.js';
import Payment from '../models/Payment.js';
import { asyncHandler, AppError } from '../middleware/error.js';
import { stripe } from '../config/payment.js';
import logger from '../utils/logger.js';

// Subscription plans
const SUBSCRIPTION_PLANS = {
  basic: {
    name: 'Basic Plan',
    price: 9.99,
    duration: 30, // days
    features: ['Access to basic courses', 'Email support', 'Mobile access']
  },
  premium: {
    name: 'Premium Plan',
    price: 19.99,
    duration: 30, // days
    features: [
      'Access to all courses',
      'Priority support',
      'Mobile access',
      'Downloadable content',
      'Certificates',
      'Live sessions'
    ]
  }
};

// @desc    Get subscription plans
// @route   GET /api/subscriptions/plans
// @access  Public
export const getSubscriptionPlans = asyncHandler(async (req, res, next) => {
  res.json({
    success: true,
    data: SUBSCRIPTION_PLANS
  });
});

// @desc    Get user subscription
// @route   GET /api/subscriptions/my
// @access  Private
export const getSubscription = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id);

  res.json({
    success: true,
    data: {
      subscription: user.subscription,
      hasAccess: user.hasPremiumAccess(),
      daysRemaining: user.subscription.endDate ? 
        Math.max(0, Math.ceil((user.subscription.endDate - new Date()) / (1000 * 60 * 60 * 24))) : 0
    }
  });
});

// @desc    Get subscription history
// @route   GET /api/subscriptions/history
// @access  Private
export const getSubscriptionHistory = asyncHandler(async (req, res, next) => {
  const payments = await Payment.find({
    user: req.user._id,
    type: { $in: ['subscription', 'subscription_renewal'] },
    status: 'completed'
  })
    .sort({ createdAt: -1 })
    .limit(20);

  res.json({
    success: true,
    count: payments.length,
    data: payments
  });
});

// @desc    Create subscription
// @route   POST /api/subscriptions/create
// @access  Private
export const createSubscription = asyncHandler(async (req, res, next) => {
  const { plan } = req.body;

  if (!SUBSCRIPTION_PLANS[plan]) {
    return next(new AppError('Invalid subscription plan', 400));
  }

  // Check if user already has active subscription
  if (req.user.hasPremiumAccess()) {
    return next(new AppError('You already have an active subscription', 400));
  }

  const planDetails = SUBSCRIPTION_PLANS[plan];

  res.json({
    success: true,
    message: 'Redirect to payment',
    data: {
      plan,
      planDetails,
      redirect: `/payment/subscription/${plan}`
    }
  });
});

// @desc    Renew subscription
// @route   POST /api/subscriptions/renew
// @access  Private
export const renewSubscription = asyncHandler(async (req, res, next) => {
  const { plan } = req.body;

  if (!SUBSCRIPTION_PLANS[plan]) {
    return next(new AppError('Invalid subscription plan', 400));
  }

  const planDetails = SUBSCRIPTION_PLANS[plan];

  res.json({
    success: true,
    message: 'Redirect to payment for renewal',
    data: {
      plan,
      planDetails,
      redirect: `/payment/subscription/${plan}`
    }
  });
});

// @desc    Upgrade subscription
// @route   POST /api/subscriptions/upgrade
// @access  Private
export const upgradeSubscription = asyncHandler(async (req, res, next) => {
  const { plan } = req.body;

  if (!SUBSCRIPTION_PLANS[plan]) {
    return next(new AppError('Invalid subscription plan', 400));
  }

  // Check if user has lower tier subscription
  if (req.user.subscription.type === 'premium') {
    return next(new AppError('You already have the highest tier subscription', 400));
  }

  if (plan === 'basic' && req.user.subscription.type === 'basic') {
    return next(new AppError('You already have this subscription plan', 400));
  }

  const planDetails = SUBSCRIPTION_PLANS[plan];

  // Calculate prorated amount if needed
  let proratedAmount = planDetails.price;
  if (req.user.subscription.endDate && req.user.subscription.endDate > new Date()) {
    const daysRemaining = Math.ceil((req.user.subscription.endDate - new Date()) / (1000 * 60 * 60 * 24));
    const currentPlanPrice = SUBSCRIPTION_PLANS[req.user.subscription.type]?.price || 0;
    const dailyRate = (planDetails.price - currentPlanPrice) / 30;
    proratedAmount = dailyRate * daysRemaining;
  }

  res.json({
    success: true,
    message: 'Redirect to payment for upgrade',
    data: {
      plan,
      planDetails,
      proratedAmount,
      redirect: `/payment/subscription/${plan}`
    }
  });
});

// @desc    Cancel subscription
// @route   PUT /api/subscriptions/cancel
// @access  Private
export const cancelSubscription = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id);

  if (!user.hasPremiumAccess()) {
    return next(new AppError('No active subscription to cancel', 400));
  }

  // Cancel at period end (don't immediately revoke access)
  user.subscription.status = 'cancelled';
  await user.save();

  // If there's a Stripe subscription, cancel it
  if (user.subscription.subscriptionId && user.subscription.paymentMethod === 'stripe') {
    try {
      await stripe.subscriptions.update(user.subscription.subscriptionId, {
        cancel_at_period_end: true
      });
    } catch (error) {
      logger.error('Failed to cancel Stripe subscription:', error);
    }
  }

  res.json({
    success: true,
    message: 'Subscription cancelled. Access will continue until the end of the billing period.',
    data: {
      subscription: user.subscription,
      accessUntil: user.subscription.endDate
    }
  });
});

// @desc    Update subscription
// @route   PUT /api/subscriptions/update
// @access  Private
export const updateSubscription = asyncHandler(async (req, res, next) => {
  // This would handle subscription updates like payment method changes
  // For now, just return current subscription
  const user = await User.findById(req.user._id);

  res.json({
    success: true,
    message: 'Subscription information',
    data: user.subscription
  });
});