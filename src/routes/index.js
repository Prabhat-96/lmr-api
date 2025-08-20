const authRouter = require('./authRoute');
const userRouter = require('./user');
const { authMiddleware } = require('../middlewares/authMiddleware');
const managementRouter = require('./management');

const express = require('express');
// Create a new Express router instance
const router = express.Router();

// Public routes for authentication (signup, signin)
router.use('/auth', authRouter);
// Protected routes for management features accessible only to superadmin and subadmin roles
router.use('/management', authMiddleware(['superadmin', 'subadmin']), managementRouter);
// Protected routes for user features accessible only to users with 'user' role
router.use('/user', authMiddleware(['user']), userRouter);

module.exports = router;