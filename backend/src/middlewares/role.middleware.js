// sugar wrapper around restrictTo for readability
const { restrictTo } = require('../middlewares/auth.middleware');


// restriction a/c to roles
exports.adminOnly = restrictTo('Admin')
exports.artisanOnly = restrictTo('Artisan');

