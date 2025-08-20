
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = '30d';

/**
 * Signup Controller
 * Handles user registration with email, password, and optional role.
 * - Checks if email already exists.
 * - Hashes password before saving.
 * - Assigns role based on the requester:
 *   - If requester is superadmin and provides role, assigns that role.
 *   - If requester is subadmin, role forced to 'user'.
 *   - If unauthenticated or others, assigns 'user' role by default.
 * - Saves new user and returns a success response.
 */
exports.signup = async (req, res) => {

  const { email, password, role } = req.body;

  try {
    // Check if user already exists with the same email
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'Email already registered',
        data: null
      });
    }
     // Hash the provided password using bcrypt
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Default role to 'user'
    let assignedRole = 'user';
    
    // Assign role only if requester is superadmin and role provided
    if (req.user && req.user.role === 'superadmin' && role) {
      assignedRole = role;
    } else if (req.user && req.user.role === 'subadmin') {
      // Subadmin can only create users with 'user' role
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

/**
 * Signin Controller
 * Handles user login with email and password.
 * - Checks if user exists.
 * - Compares password with hashed password.
 * - Returns JWT token on successful authentication.
 */
exports.signin = async (req, res) => {
  try {
    const { email, password } = req.body;
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
        data: null
      });
    }
    
    
    // Compare provided password with stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
        data: null
      });
    }
    
    // Generate JWT token containing user ID, role, and email
    const token = jwt.sign(
      { _id: user._id, role: user.role, email: user.email },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );
     // Send token as response
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
