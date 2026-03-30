const express = require('express');
const { createRazorpayOrder, createStripeIntent, razorpayWebhook } = require('./payment.controller');
const { protect } = require('../../middleware/auth.middleware');

const router = express.Router();

router.post('/razorpay', protect, createRazorpayOrder);
router.post('/stripe', protect, createStripeIntent);
router.post('/webhook/razorpay', razorpayWebhook);

module.exports = router;
