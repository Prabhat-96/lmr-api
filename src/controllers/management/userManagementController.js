const User = require("../../models/User");

exports.getUser = async (req, res) => {
  try {
    const { id } = req.query;
    const { page = 1, limit = 10 } = req.query;
    console.log(req.user);
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
      const skip = (parseInt(page) - 1) * parseInt(limit);

      const users = await User.find()
        .select('-password')
        .skip(skip)
        .limit(parseInt(limit))
        .sort({ createdAt: -1 });

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
