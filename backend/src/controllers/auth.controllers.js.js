const User = require('../models/user.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');



// sign token
const signToken = (id, role) => 
  jwt.sign({id, role}, process.env.JWT_SECRET || 'dev', {expiresIn:"7d"});


// Register
exports.register = async (req, res) =>{
  try {
    const {name, email, password, role} = req.body;
    
    if (await User.findOne({email}))
      return res.status(409).json({message:'Email already exists'});

    const user = await User.create({name, email, password, role});
    res.status(201).json({token:signToken(user._id, user.role)})
  } catch (error) {
    res.status(500).json({message:'Server error', error:error.message})
  }
}


// login

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await bcrypt.compare(password, user.password)))
      return res.status(401).json({ message: 'Invalid User or Email' });

    // Generate token with id and role
    const token = signToken(user._id, user.role);

    // Respond with both token and user info (including role)
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,  // <-- Include role here
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


// google login
exports.googleLogin = async (req, res) => {
  try {
    const { email, name, googleId, avatar } = req.body;

    if (!email || !googleId) {
      return res.status(400).json({ message: 'Missing Google account info' });
    }

    let user = await User.findOne({ email });

    if (!user) {
      // Create user if not found
      user = await User.create({
        name,
        email,
        password: googleId, // just a dummy password, not used
        googleId,
        avatar,
        role: 'Customer',
      });
    }

    const token = signToken(user._id, user.role);

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      },
    });
  } catch (err) {
    console.error('Google login error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};






// google register



exports.googleOAuth = async (req, res) => {
  const { email, name } = req.body;

  try {
    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        name,
        email,
        password: 'google_oauth_user', // placeholder
        role: 'Customer',
      });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || 'dev', {
      expiresIn: '7d',
    });

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ message: 'Google login failed', error: err.message });
  }
};





