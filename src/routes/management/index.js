const express = require('express');
const { authMiddleware } = require('../../middlewares/authMiddleware');
const userManagementRouter = require('./userManagementRoutes');
const bookManagementRouter = require('./bookManagementRoutes');
const managementRouter = express.Router();

managementRouter.use('/user', authMiddleware(['superadmin']), userManagementRouter);
managementRouter.use('/book', authMiddleware(['superadmin', 'subadmin']), bookManagementRouter);

module.exports = managementRouter;