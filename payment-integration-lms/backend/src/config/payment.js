import paypal from 'paypal-rest-sdk';
import Stripe from 'stripe';

// PayPal Configuration
paypal.configure({
  mode: process.env.PAYPAL_MODE || 'sandbox', // 'live' for production
  client_id: process.env.PAYPAL_CLIENT_ID,
  client_secret: process.env.PAYPAL_CLIENT_SECRET
});

// Stripe Configuration
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
});

export { paypal, stripe };