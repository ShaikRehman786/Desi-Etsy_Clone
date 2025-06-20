const router  = require('express').Router();
const ctrl = require('../controllers/order.model');
const { protect, restrictTo } = require('../middlewares/auth.middleware');

// customer
router.post('/checkout', protect, restrictTo('Customer'), ctrl.checkout);
router.post('/verify', ctrl.verify);
router.get('/my', protect, restrictTo('Customer'), ctrl.myOrders);


// status updates (artisan/admin)
router.put('/:id/status', protect, restrictTo('Artisan', 'Admin'), ctrl.updateStatus);


module.exports = router;
