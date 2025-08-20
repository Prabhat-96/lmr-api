const express = require('express');
const { getUser, deleteUser } = require('../../controllers/management/userManagementController');
const userManagementRouter = express.Router();

userManagementRouter.get('/getuser', getUser);
userManagementRouter.delete('/deleteuser/:id', deleteUser);

module.exports = userManagementRouter;