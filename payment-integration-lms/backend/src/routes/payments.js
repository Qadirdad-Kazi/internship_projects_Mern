import express from 'express';
import { protect, authorize } from '../middleware/auth.js';
import {
  createPayPalPayment,
  executePayPalPayment,
  createStripeCheckout,
  handleStripeWebhook,
  handlePayPalWebhook,
  getPaymentHistory,
  getPaymentById,
  refundPayment,
  getPaymentStats
} from '../controllers/paymentController.js';

const router = express.Router();

// PayPal Routes
router.post('/paypal/create', protect, createPayPalPayment);
router.post('/paypal/execute', protect, executePayPalPayment);

// Stripe Routes
router.post('/stripe/create-checkout', protect, createStripeCheckout);

// Webhook Routes (no auth required - verified by signature)
router.post('/webhooks/stripe', express.raw({ type: 'application/json' }), handleStripeWebhook);
router.post('/webhooks/paypal', handlePayPalWebhook);

// Protected Routes
router.use(protect); // All routes below require authentication

// User payment routes
router.get('/history', getPaymentHistory);
router.get('/:id', getPaymentById);

// Admin routes
router.post('/:id/refund', authorize('admin'), refundPayment);
router.get('/admin/stats', authorize('admin'), getPaymentStats);

export default router;