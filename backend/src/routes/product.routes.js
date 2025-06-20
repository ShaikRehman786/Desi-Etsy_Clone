const router = require('express').Router();
const ctrl = require('../controllers/product.model'); // or update to 'product.controller' if renamed
const { protect, restrictTo } = require('../middlewares/auth.middleware');
const productModel = require('../controllers/product.model');

// Public routes
router.get('/', ctrl.getAll); // ✅ Gets all products
router.get('/:id', ctrl.getOne); // ✅ Get single product

// Artisan routes
router.get('/my', protect, restrictTo('artisan'), ctrl.getMyProducts); // ✅ Now distinct
router.post('/', protect, restrictTo('artisan'), ctrl.create);
router.put('/:id', protect, restrictTo('artisan'), ctrl.update);
router.delete('/:id', protect, restrictTo('artisan'), ctrl.del);

module.exports = router;
