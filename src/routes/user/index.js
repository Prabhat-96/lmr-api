const express = require('express');
const { authMiddleware } = require('../../middlewares/authMiddleware');
const userAndBookRouter = require('./userAndBookRoutes');
const userRouter = express.Router();

// Apply auth middleware to protect all routes under /userandbook
// Only users with role 'user' can access these routes
userRouter.use('/userandbook', authMiddleware(['user']), userAndBookRouter);

module.exports = userRouter;