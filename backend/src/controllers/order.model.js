const crypto   = require('crypto');
const razorpay = require('../config/razorpay');
const Order    = require('../models/order.model');
const Product  = require('../models/product.model');

const calcSubtotal = (items = []) =>
  items.reduce((sum, it) => sum + it.price * it.qty, 0);

exports.checkout = async (req, res) => {
  try {
    const cart = req.body.cart;
    if (!Array.isArray(cart) || cart.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: 'Unauthorized: User not logged in' });
    }

    console.log('Cart received:', cart);
    console.log('User:', req.user._id);

    const items = await Promise.all(
      cart.map(async ({ productId, qty }) => {
        if (!qty || qty < 1) throw new Error('Quantity must be ≥ 1');
        const p = await Product.findById(productId).select('price artisan');
        if (!p) throw new Error(`Product ${productId} not found`);
        return {
          product : p._id,
          qty,
          price   : p.price,
          artisan : p.artisan,
        };
      })
    );

    const subtotal = calcSubtotal(items);
    console.log('Subtotal:', subtotal);

    // Create Razorpay order
    const rzpOrder = await razorpay.orders.create({
      amount   : subtotal * 100, // amount in paise
      currency : 'INR',
    });

    console.log('Razorpay order created:', rzpOrder);

    // Save order to DB
    const order = await Order.create({
      customer : req.user._id,
      items,
      subtotal,
      status   : 'Created',
      razorpay : { order_id: rzpOrder.id },
    });

    res.status(201).json({
      orderId    : order._id,
      rzpOrderId : rzpOrder.id,
      amount     : subtotal,
      key        : process.env.RZP_KEY_ID,
    });
  }catch (err) {
  console.error('CHECKOUT ERROR:', err);      // already there
  return res.status(500).json({
    message : 'Server error',
    error   : err.message,                    // show message only
    stack   : process.env.NODE_ENV === 'dev' ? err.stack : undefined
  });
}
};

exports.verify = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ message: 'Missing Razorpay payment fields' });
    }

    if (!process.env.RZP_KEY_SECRET) {
      return res.status(500).json({ message: 'RZP_KEY_SECRET not configured' });
    }

    // Generate expected signature
    const expected = crypto
      .createHmac('sha256', process.env.RZP_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (expected !== razorpay_signature) {
      return res.status(400).json({ message: 'Signature mismatch' });
    }

    const order = await Order.findOneAndUpdate(
      { 'razorpay.order_id': razorpay_order_id },
      {
        status   : 'Paid',
        razorpay : {
          payment_id: razorpay_payment_id,
          signature : razorpay_signature,
        },
      },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json({ success: true, order });
  } catch (err) {
    console.error('VERIFY ERROR:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.myOrders = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: 'Unauthorized: User not logged in' });
    }

    const orders = await Order.find({ customer: req.user._id })
      .populate('items.product', 'title price images')
      .sort('-createdAt');

    res.json(orders);
  } catch (err) {
    console.error('MY ORDERS ERROR:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ message: 'Status is required' });
    }
    const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json(order);
  } catch (err) {
    console.error('UPDATE STATUS ERROR:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
