const router = require('express').Router();
const a = require('../controllers/admin.controller');
const pc = require('../controllers/product.model');
const { protect } = require('../middlewares/auth.middleware');
const { adminOnly } = require('../middlewares/role.middleware');


// all routes require admin auth

router.use(protect, adminOnly)

// dashboard counts

router.get('/overview', a.overview)




// artisan approval
router.get('/artisans/pending',a.listArtisanPending);
router.put('/artisans/:id/approve', a.approveArtisan);
router.delete('/artisans/:id/reject',a.rejectArtisan);


// product approval
router.get('/products/pending',pc.adminListPending);
router.put('/products/:id/approve', pc.adminApprove);
router.delete('/products/:id/reject', pc.adminReject);



module.exports = router;