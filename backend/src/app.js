
// const express = require('express');
// const cors = require('cors');
// require('dotenv').config();

// const app = express();

// // Import route files
// const authRoutes = require('./routes/auth.routes');
// const productRoutes = require('./routes/product.routes');
// const orderRoutes = require('./routes/order.routes');
// const adminRoutes = require('./routes/admin.routes');
// const cartRoutes = require('./routes/cart.routes');
// const paymentRoutes = require('./routes/payment'); // Razorpay routes

// // Middleware
// app.use(cors());
// app.use(express.json());

// // Routes
// app.use('/api/auth', authRoutes);
// app.use('/api/products', productRoutes);
// app.use('/api/orders', orderRoutes);
// app.use('/api/admin', adminRoutes);
// app.use('/api/cart', cartRoutes);

// // Razorpay payment routes
// app.use('/api/payment', paymentRoutes);

// module.exports = app;












const express = require('express');
const cors = require('cors');
// require('dotenv').config();

const app = express();

// Import route files
const authRoutes = require('./routes/auth.routes');
const productRoutes = require('./routes/product.routes');
const orderRoutes = require('./routes/order.routes');
const adminRoutes = require('./routes/admin.routes');
const cartRoutes = require('./routes/cart.routes');
const paymentRoutes = require('./routes/payment'); // Razorpay routes

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/payment', paymentRoutes);

module.exports = app;
