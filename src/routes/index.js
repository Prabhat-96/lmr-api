const authRouter = require('./authRoute');
const userRouter = require('./user');

const express = require('express');
const { authMiddleware } = require('../middlewares/authMiddleware');
const managementRouter = require('./management');
const router = express.Router();

router.use('/auth', authRouter);
router.use('/management', authMiddleware(['superadmin', 'subadmin']), managementRouter);
router.use('/user', authMiddleware(['user']), userRouter);

module.exports = router;