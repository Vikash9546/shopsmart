const asyncHandler = require('../../utils/asyncHandler');
const Order = require('../order/order.model');
const Razorpay = require('razorpay');
const stripe = require('stripe')(process.env.STRIPE_API_KEY);

// @desc    Create Razorpay Order
// @route   POST /api/v1/payments/razorpay
// @access  Private
const createRazorpayOrder = asyncHandler(async (req, res) => {
  const { amount, currency = 'INR', receipt } = req.body;

  const instance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });

  const options = {
    amount: amount * 100, // amount in the smallest currency unit
    currency,
    receipt,
  };

  const order = await instance.orders.create(options);

  if (!order) {
    return res.status(500).json({ success: false, message: 'Failed to create Razorpay order' });
  }

  res.json({ success: true, order });
});

// @desc    Create Stripe Payment Intent
// @route   POST /api/v1/payments/stripe
// @access  Private
const createStripeIntent = asyncHandler(async (req, res) => {
  const { amount, currency = 'usd' } = req.body;

  const paymentIntent = await stripe.paymentIntents.create({
    amount: amount * 100,
    currency,
  });

  res.json({
    success: true,
    clientSecret: paymentIntent.client_secret,
  });
});

// @desc    Payment Webhook (Razorpay)
// @route   POST /api/v1/payments/webhook/razorpay
// @access  Public
const razorpayWebhook = asyncHandler(async (req, res) => {
  // Logic to verify signature and update order status
  // This would use crypto to verify the x-razorpay-signature
  console.log('Razorpay Webhook Received:', req.body);
  res.json({ status: 'ok' });
});

module.exports = {
  createRazorpayOrder,
  createStripeIntent,
  razorpayWebhook,
};
