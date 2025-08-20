const User = require("../../models/User");

/**
 * Retrieves user information.
 * - If "id" query param is provided, returns the specific user (excluding password).
 * - Otherwise returns a paginated list of users.
 * 
 * Pagination supported via "page" and "limit" query params (default page=1, limit=10).
 * Excludes password field from the response for security.
 */
exports.getUser = async (req, res) => {
  try {
    const { id } = req.query;
    const { page = 1, limit = 10 } = req.query;

    // Fetch single user by ID
    if (id) {
      const user = await User.findById(id).select('-password');
      if (!user) { 
        return res.status(200).json({
          success: false,
          message: 'User not found',
          data: null
        });
      }
      return res.status(200).json({
        success: true,
        message: 'User retrieved successfully',
        data: user
      });
    } else {
      // Calculate records to skip for pagination
      const skip = (parseInt(page) - 1) * parseInt(limit);
      
      // Fetch paginated list of users excluding passwords
      const users = await User.find()
        .select('-password')
        .skip(skip)
        .limit(parseInt(limit))
        .sort({ createdAt: -1 });
      
      // Total count of users for pagination
      const total = await User.countDocuments();

      return res.status(200).json({
        success: true,
        message: 'Users retrieved successfully',
        data: {
          users,
          pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total
          }
        }
      });
    }
  } catch (error) {
    console.error('getUser error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error retrieving users',
      data: null
    });
  }
};


/**
 * Deletes a user by their ID.
 * Validates presence of user ID in URL params.
 * Returns appropriate responses if user not found or on successful deletion.
 */
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id) {
      return res.status(200).json({
        success: false,
        message: 'User ID is required',
        data: null
      });
    }
    
    // Find user to delete
    const user = await User.findById(id);
    if (!user) {
      return res.status(200).json({
        success: false,
        message: 'User not found',
        data: null
      });
    }

    await user.deleteOne();

    return res.status(200).json({
      success: true,
      message: 'User deleted successfully',
      data: null
    });
  } catch (error) {
    console.error('deleteUser error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error deleting user',
      data: null
    });
  }
};
