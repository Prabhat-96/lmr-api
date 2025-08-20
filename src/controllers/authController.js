
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = '30d';

// Signup Controller
exports.signup = async (req, res) => {

  const { email, password, role } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'Email already registered',
        data: null
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    let assignedRole = 'user';

    if (req.user && req.user.role === 'superadmin' && role) {
      assignedRole = role;
    } else if (req.user && req.user.role === 'subadmin') {
      assignedRole = 'user';
    }

    const newUser = new User({
      email,
      password: hashedPassword,
      role: assignedRole
    });

    await newUser.save();

    return res.status(200).json({
      success: true,
      message: 'User registered successfully',
      data: null
    });
  } catch (error) {
    console.error('Signup error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error during signup',
      data: null
    });
  }
};

// Signin Controller
exports.signin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
        data: null
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
        data: null
      });
    }

    const token = jwt.sign(
      { _id: user._id, role: user.role, email: user.email },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      data: { token }
    });
  } catch (error) {
    console.error('Signin error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error during signin',
      data: null
    });
  }
};
