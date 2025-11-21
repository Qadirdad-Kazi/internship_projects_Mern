import { paypal, stripe } from '../config/payment.js';
import Payment from '../models/Payment.js';
import Course from '../models/Course.js';
import User from '../models/User.js';
import { asyncHandler, AppError } from '../middleware/error.js';
import logger from '../utils/logger.js';

// @desc    Create PayPal payment
// @route   POST /api/payments/paypal/create
// @access  Private
export const createPayPalPayment = asyncHandler(async (req, res, next) => {
  const { courseId, type = 'course_purchase', subscriptionPlan } = req.body;
  
  let amount, currency = 'USD', description;
  
  if (type === 'course_purchase') {
    const course = await Course.findById(courseId);
    if (!course) {
      return next(new AppError('Course not found', 404));
    }
    
    // Check if user already owns the course
    if (req.user.ownsCourse(courseId)) {
      return next(new AppError('You already own this course', 400));
    }
    
    amount = course.effectivePrice;
    description = `Purchase: ${course.title}`;
  } else if (type === 'subscription') {
    const plans = {
      basic: { amount: 9.99, description: 'Basic Monthly Subscription' },
      premium: { amount: 19.99, description: 'Premium Monthly Subscription' }
    };
    
    if (!plans[subscriptionPlan]) {
      return next(new AppError('Invalid subscription plan', 400));
    }
    
    amount = plans[subscriptionPlan].amount;
    description = plans[subscriptionPlan].description;
  }

  const paymentData = {
    intent: 'sale',
    payer: {
      payment_method: 'paypal'
    },
    redirect_urls: {
      return_url: `${process.env.FRONTEND_URL}/payment/success`,
      cancel_url: `${process.env.FRONTEND_URL}/payment/cancel`
    },
    transactions: [{
      item_list: {
        items: [{
          name: description,
          sku: courseId || subscriptionPlan,
          price: amount.toString(),
          currency: currency,
          quantity: 1
        }]
      },
      amount: {
        currency: currency,
        total: amount.toString()
      },
      description: description
    }]
  };

  paypal.payment.create(paymentData, async (error, payment) => {
    if (error) {
      logger.error('PayPal payment creation failed:', error);
      return next(new AppError('PayPal payment creation failed', 500));
    }

    // Create payment record
    const newPayment = new Payment({
      user: req.user._id,
      course: courseId,
      type,
      paymentMethod: 'paypal',
      paymentGateway: {
        paymentId: payment.id
      },
      amount: {
        value: amount,
        currency
      },
      netAmount: amount,
      metadata: {
        subscriptionPlan
      }
    });

    await newPayment.save();

    // Find approval URL
    const approvalUrl = payment.links.find(link => link.rel === 'approval_url');

    res.status(201).json({
      success: true,
      paymentId: payment.id,
      approvalUrl: approvalUrl.href,
      payment: newPayment
    });
  });
});

// @desc    Execute PayPal payment
// @route   POST /api/payments/paypal/execute
// @access  Private
export const executePayPalPayment = asyncHandler(async (req, res, next) => {
  const { paymentId, payerId } = req.body;

  const payment = await Payment.findOne({ 'paymentGateway.paymentId': paymentId });
  if (!payment) {
    return next(new AppError('Payment not found', 404));
  }

  const executeData = {
    payer_id: payerId
  };

  paypal.payment.execute(paymentId, executeData, async (error, paypalPayment) => {
    if (error) {
      logger.error('PayPal payment execution failed:', error);
      payment.markFailed('PayPal execution failed');
      await payment.save();
      return next(new AppError('Payment execution failed', 500));
    }

    if (paypalPayment.state === 'approved') {
      // Update payment record
      payment.markCompleted();
      payment.paymentGateway.payerId = payerId;
      await payment.save();

      // Update user's course or subscription
      if (payment.type === 'course_purchase') {
        req.user.courses.push({
          course: payment.course,
          purchaseDate: new Date(),
          paymentId: payment._id,
          amount: payment.amount.value
        });
      } else if (payment.type === 'subscription') {
        req.user.subscription = {
          type: payment.metadata.subscriptionPlan,
          status: 'active',
          startDate: new Date(),
          endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
          paymentMethod: 'paypal'
        };
      }

      await req.user.save();

      // Update course enrollment count
      if (payment.course) {
        await Course.findByIdAndUpdate(payment.course, {
          $inc: { studentsEnrolled: 1 }
        });
      }

      res.json({
        success: true,
        message: 'Payment completed successfully',
        payment
      });
    } else {
      payment.markFailed('PayPal payment not approved');
      await payment.save();
      return next(new AppError('Payment not approved', 400));
    }
  });
});

// @desc    Create Stripe checkout session
// @route   POST /api/payments/stripe/create-checkout
// @access  Private
export const createStripeCheckout = asyncHandler(async (req, res, next) => {
  const { courseId, type = 'course_purchase', subscriptionPlan } = req.body;
  
  let amount, description, metadata = {};
  
  if (type === 'course_purchase') {
    const course = await Course.findById(courseId);
    if (!course) {
      return next(new AppError('Course not found', 404));
    }
    
    if (req.user.ownsCourse(courseId)) {
      return next(new AppError('You already own this course', 400));
    }
    
    amount = Math.round(course.effectivePrice * 100); // Stripe uses cents
    description = `Purchase: ${course.title}`;
    metadata = { courseId, type, userId: req.user._id.toString() };
  } else if (type === 'subscription') {
    const plans = {
      basic: { amount: 999, description: 'Basic Monthly Subscription' }, // $9.99 in cents
      premium: { amount: 1999, description: 'Premium Monthly Subscription' } // $19.99 in cents
    };
    
    if (!plans[subscriptionPlan]) {
      return next(new AppError('Invalid subscription plan', 400));
    }
    
    amount = plans[subscriptionPlan].amount;
    description = plans[subscriptionPlan].description;
    metadata = { subscriptionPlan, type, userId: req.user._id.toString() };
  }

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [{
      price_data: {
        currency: 'usd',
        product_data: {
          name: description,
        },
        unit_amount: amount,
      },
      quantity: 1,
    }],
    mode: 'payment',
    success_url: `${process.env.FRONTEND_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.FRONTEND_URL}/payment/cancel`,
    metadata,
    customer_email: req.user.email,
  });

  // Create payment record
  const newPayment = new Payment({
    user: req.user._id,
    course: courseId,
    type,
    paymentMethod: 'stripe',
    paymentGateway: {
      sessionId: session.id
    },
    amount: {
      value: amount / 100, // Convert back to dollars
      currency: 'USD'
    },
    netAmount: amount / 100,
    metadata: {
      subscriptionPlan
    }
  });

  await newPayment.save();

  res.status(201).json({
    success: true,
    sessionId: session.id,
    url: session.url,
    payment: newPayment
  });
});

// @desc    Handle Stripe webhook
// @route   POST /api/payments/webhooks/stripe
// @access  Public (verified by signature)
export const handleStripeWebhook = asyncHandler(async (req, res, next) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    logger.error('Stripe webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object;
      await handleStripePaymentSuccess(session);
      break;
    case 'payment_intent.payment_failed':
      const paymentIntent = event.data.object;
      await handleStripePaymentFailed(paymentIntent);
      break;
    default:
      logger.info(`Unhandled Stripe event type: ${event.type}`);
  }

  res.json({ received: true });
});

// Helper function to handle successful Stripe payments
const handleStripePaymentSuccess = async (session) => {
  try {
    const payment = await Payment.findOne({ 'paymentGateway.sessionId': session.id });
    if (!payment) {
      logger.error('Payment not found for session:', session.id);
      return;
    }

    // Update payment record
    payment.markCompleted();
    payment.paymentGateway.paymentId = session.payment_intent;
    await payment.save();

    // Update user
    const user = await User.findById(payment.user);
    if (!user) {
      logger.error('User not found for payment:', payment._id);
      return;
    }

    if (payment.type === 'course_purchase') {
      user.courses.push({
        course: payment.course,
        purchaseDate: new Date(),
        paymentId: payment._id,
        amount: payment.amount.value
      });
    } else if (payment.type === 'subscription') {
      user.subscription = {
        type: payment.metadata.subscriptionPlan,
        status: 'active',
        startDate: new Date(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        paymentMethod: 'stripe'
      };
    }

    await user.save();

    // Update course enrollment
    if (payment.course) {
      await Course.findByIdAndUpdate(payment.course, {
        $inc: { studentsEnrolled: 1 }
      });
    }

    logger.info('Payment processed successfully:', payment._id);
  } catch (error) {
    logger.error('Error processing Stripe payment success:', error);
  }
};

// @desc    Handle PayPal webhook
// @route   POST /api/payments/webhooks/paypal
// @access  Public
export const handlePayPalWebhook = asyncHandler(async (req, res, next) => {
  // PayPal webhook handling logic would go here
  // This is a simplified version
  res.json({ received: true });
});

// @desc    Get user payment history
// @route   GET /api/payments/history
// @access  Private
export const getPaymentHistory = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const status = req.query.status;

  const payments = await Payment.findByUser(req.user._id, status)
    .limit(limit * 1)
    .skip((page - 1) * limit);

  const total = await Payment.countDocuments({ 
    user: req.user._id,
    ...(status && { status })
  });

  res.json({
    success: true,
    count: payments.length,
    total,
    pagination: {
      page,
      pages: Math.ceil(total / limit),
      limit
    },
    data: payments
  });
});

// @desc    Get payment by ID
// @route   GET /api/payments/:id
// @access  Private
export const getPaymentById = asyncHandler(async (req, res, next) => {
  const payment = await Payment.findById(req.params.id)
    .populate('user', 'name email')
    .populate('course', 'title pricing thumbnail');

  if (!payment) {
    return next(new AppError('Payment not found', 404));
  }

  // Check if user owns this payment or is admin
  if (payment.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return next(new AppError('Not authorized to access this payment', 403));
  }

  res.json({
    success: true,
    data: payment
  });
});

// @desc    Refund payment
// @route   POST /api/payments/:id/refund
// @access  Private (Admin only)
export const refundPayment = asyncHandler(async (req, res, next) => {
  const { amount, reason } = req.body;
  
  const payment = await Payment.findById(req.params.id);
  if (!payment) {
    return next(new AppError('Payment not found', 404));
  }

  if (payment.status !== 'completed') {
    return next(new AppError('Can only refund completed payments', 400));
  }

  const refundAmount = amount || payment.amount.value;

  try {
    let refundResult;
    
    if (payment.paymentMethod === 'stripe') {
      refundResult = await stripe.refunds.create({
        payment_intent: payment.paymentGateway.paymentId,
        amount: Math.round(refundAmount * 100) // Convert to cents
      });
      
      payment.refund.refundId = refundResult.id;
    } else if (payment.paymentMethod === 'paypal') {
      // PayPal refund logic would go here
      // This is a simplified version
      payment.refund.refundId = `PP_${Date.now()}`;
    }

    payment.processRefund(refundAmount, reason);
    await payment.save();

    res.json({
      success: true,
      message: 'Refund processed successfully',
      data: payment
    });
  } catch (error) {
    logger.error('Refund processing failed:', error);
    return next(new AppError('Refund processing failed', 500));
  }
});

// @desc    Get payment statistics (Admin)
// @route   GET /api/payments/admin/stats
// @access  Private (Admin only)
export const getPaymentStats = asyncHandler(async (req, res, next) => {
  const { startDate, endDate } = req.query;
  
  const start = startDate ? new Date(startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const end = endDate ? new Date(endDate) : new Date();

  const stats = await Payment.getStats(start, end);

  const totalRevenue = await Payment.aggregate([
    {
      $match: {
        status: 'completed',
        createdAt: { $gte: start, $lte: end }
      }
    },
    {
      $group: {
        _id: null,
        total: { $sum: '$amount.value' },
        count: { $sum: 1 }
      }
    }
  ]);

  res.json({
    success: true,
    data: {
      dailyStats: stats,
      summary: totalRevenue[0] || { total: 0, count: 0 }
    }
  });
});