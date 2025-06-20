

const router = require('express').Router();
const { register, login, googleLogin, googleOAuth } = require('../controllers/auth.controllers.js');
const { protect } = require('../middlewares/auth.middleware.js');


// Existing auth routes
router.post('/register', register);
router.post('/login', login);

// google login
router.post('/google-login', googleLogin);

// google register
router.post('/google', googleOAuth);



// New route to get current user info using token
router.get('/me', protect, (req, res) => {
  res.json(req.user); // send back the user object attached by middleware
});

module.exports = router;
