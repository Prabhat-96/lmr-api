const express = require('express');
const { authMiddleware } = require('../../middlewares/authMiddleware');
const userAndBookRouter = require('./userAndBookRoutes');
const userRouter = express.Router();

userRouter.use('/userandbook', authMiddleware(['user']), userAndBookRouter);

module.exports = userRouter;