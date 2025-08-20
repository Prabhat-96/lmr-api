const express = require('express');
const connectDB = require('./config/db');  // Import function to connect to MongoDB database
const app = express();   // Create an Express application instance
require('dotenv').config();   // Load environment variables from .env file
const router = require('./routes');  // Import main router collection of all routes

const PORT = process.env.PORT;    // Get port number from environment variables

// Middleware to parse incoming JSON requests
app.use(express.json());

connectDB();  // Establish connection to the database


// Mount the main router at the '/api/v1' path prefix
app.use('/api/v1', router);

// Define a check endpoint at root to confirm server is running
app.get('/',(req,res)=>{
    res.status(200).json({
        success: true,
        message: "Sever is Running",
        data: null
    })
})


// Start the server and listen on the specified port
app.listen(PORT,()=>{
    console.log("Server is running on port", PORT);
});