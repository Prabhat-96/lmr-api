const express = require('express');
const { signup } = require('../../controllers/authController');
const { authMiddleware } = require('../../middlewares/authMiddleware');
const userManagementRouter = require('./userManagementRoutes');
const bookManagementRouter = require('./bookManagementRoutes');
const managementRouter = express.Router();

// Protected signup for superadmin/subadmin to create users with roles
managementRouter.post('/signup', signup);
// Protect user management routes under '/user' - accessible only by 'superadmin' role for user control operation
managementRouter.use('/user', authMiddleware(['superadmin']), userManagementRouter);
// Protect book management routes under '/book' - accessible by 'superadmin' and 'subadmin' roles
managementRouter.use('/book', authMiddleware(['superadmin', 'subadmin']), bookManagementRouter);

module.exports = managementRouter;