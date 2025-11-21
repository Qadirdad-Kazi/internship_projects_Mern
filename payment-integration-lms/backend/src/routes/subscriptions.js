import express from 'express';
import { protect, authorize } from '../middleware/auth.js';
import {
  createSubscription,
  cancelSubscription,
  updateSubscription,
  getSubscription,
  getSubscriptionHistory,
  renewSubscription,
  upgradeSubscription,
  getSubscriptionPlans
} from '../controllers/subscriptionController.js';

const router = express.Router();

// Public routes
router.get('/plans', getSubscriptionPlans);

// Protected routes
router.use(protect); // All routes below require authentication

router.get('/my', getSubscription);
router.get('/history', getSubscriptionHistory);
router.post('/create', createSubscription);
router.post('/renew', renewSubscription);
router.post('/upgrade', upgradeSubscription);
router.put('/cancel', cancelSubscription);
router.put('/update', updateSubscription);

export default router;