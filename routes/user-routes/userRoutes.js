const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');


const User = require("../../models/user/UserModal");
const { PASSWORD_REGX } = require('../../global/constants/validationregex/validationregex');
const verifyToken = require('../../middleweres/auth');
const { errorHandler } = require('../../global/constants/response/resoponse');



// // Example User Schema
// const userSchema = new mongoose.Schema({
//   username: { type: String, required: true, unique: true },
//   email: { type: String, required: true, unique: true },
//   password: { type: String, required: true },
//   admin: { type: Boolean, default: false },
// }, { timestamps: true });



// JWT Verification Middleware


// Routes
const validatePassword = (password) => {
  const passwordRegex =PASSWORD_REGX;
  return passwordRegex.test(password);
};

router.post('/register', async (req, res, next) => {
  const { username, email, password, admin } = req.body;

  try {
    // Validate required fields
    if (!username || !email || !password) {
      throw new Error('All fields (username, email, password) are required');
    }

    // Validate password complexity
    if (!validatePassword(password)) {
      throw new Error(
        'Password must be at least 8 characters long, include uppercase, lowercase, a number, and a special character'
      );
    }

    // Check for existing user
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      throw new Error('User with this username or email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      admin: admin || false,
    });

    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    next(err); // Pass error to error handler middleware
  }
});


// Login user
router.post('/login', async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) throw new Error('User not found');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error('Invalid email or password');

    const token = jwt.sign({ id: user._id, admin: user.admin }, "token-reg", { expiresIn: '1h' });
    res.cookie('token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 3600000,
    });
    res.json({ message: 'Login successful' , user});
  } catch (err) {
    next(err);
  }
});

// Logout user
router.post('/logout', (req, res, next) => {
  try {
    res.clearCookie('token');
    res.json({ message: 'Logged out successfully' });
  } catch (err) {
    next(err);
  }
});

// Example protected route
router.get('/profile',verifyToken , async (req, res, next) => {
  
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) throw new Error('User not found');

    res.json({user});
  } catch (err) {
    next(err); 
  }
});

// Attach error handler middleware
router.use(errorHandler);

module.exports = router;
