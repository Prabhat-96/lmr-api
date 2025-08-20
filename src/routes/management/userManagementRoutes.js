const express = require('express');
const { getUser, deleteUser } = require('../../controllers/management/userManagementController');
const userManagementRouter = express.Router();

// Route to retrieve users - supports fetching all users or a single user by ID
userManagementRouter.get('/getuser', getUser);
// Route to delete a user by their ID
userManagementRouter.delete('/deleteuser/:id', deleteUser);

module.exports = userManagementRouter;