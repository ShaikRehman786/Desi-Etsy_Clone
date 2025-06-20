const express = require('express');
const Razorpay = require('razorpay');
const crypto = require('crypto');
require('dotenv').config();

const router = express.Router();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create order
router.post('/create-order', async (req, res) => {
  const { amount } = req.body;

  // ✅ Debug logs
  console.log("Amount:", amount);
  console.log("KEY_ID:", process.env.RAZORPAY_KEY_ID);
  console.log("KEY_SECRET:", process.env.RAZORPAY_KEY_SECRET);

  if (!amount || typeof amount !== "number") {
    return res.status(400).json({ error: "Invalid amount" });
  }

  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    return res.status(500).json({ error: 'Missing Razorpay environment variables' });
  }

  try {
    const options = {
      amount,
      currency: 'INR',
      receipt: `receipt_order_${Date.now()}`,
      payment_capture: 1,
    };

    const order = await razorpay.orders.create(options);
    return res.json(order);
  } catch (error) {
    console.error("❌ Razorpay Error:", error);
    res.status(500).json({ error: error.message || "Failed to create order" });
  }
});

// Verify payment signature
router.post('/verify-payment', (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  const generated_signature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(razorpay_order_id + '|' + razorpay_payment_id)
    .digest('hex');

  if (generated_signature === razorpay_signature) {
    return res.json({ status: 'success' });
  } else {
    return res.status(400).json({ status: 'failed', message: 'Invalid signature' });
  }
});

module.exports = router;
