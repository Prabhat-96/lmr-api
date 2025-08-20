const jwt = require('jsonwebtoken');

// JWT secret key loaded from environment variables
const JWT_SECRET = process.env.JWT_SECRET;

/**
 * Middleware to authenticate JWT tokens and authorize based on user roles.
 * 
 *@param {Array} allowedRoles - Array of roles allowed to access the route. If empty, route is accessible by any authenticated user.
 * 
 * Usage:
 *  app.get('/protected', authMiddleware(['superadmin', 'user']), handler);
 */
exports.authMiddleware = (allowedRoles = []) => {
  return (req, res, next) => {
    // Retrieve the Authorization header
    const authHeader = req.headers.authorization;
    
    // Check if Authorization header exists and starts with 'Bearer '
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Authorization token missing or malformed',
        data: null
      });
    }
    
    // Extract token part from 'Bearer <token>'
    const token = authHeader.split(' ')[1];
    
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      // Attach decoded user info to request object for downstream use
      req.user = {
        _id: decoded._id,
        role: decoded.role,
        email: decoded.email
      };

      // Check if user's role is allowed
      if (allowedRoles.length && !allowedRoles.includes(req.user.role)) {
        return res.status(403).json({
          success: false,
          message: 'Forbidden: Access denied',
          data: null
        });
      }
      // Proceed to next middleware or route handler
      next();
    } catch (error) {
      // Handle invalid or expired token error
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired token',
        data: null
      });
    }
  };
};
