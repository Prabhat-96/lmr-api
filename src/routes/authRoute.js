const express = require('express');
const { signup, signin } = require('../controllers/authController');
// Create a new router object for authentication routes
const authRouter = express.Router();

// Route for user signup - creates a new user account
authRouter.post('/signup', signup);
// Route for user signin - authenticates user and returns JWT token
authRouter.post('/signin', signin);

module.exports = authRouter;