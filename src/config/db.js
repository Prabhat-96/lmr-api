// Import mongoose for MongoDB
const mongoose = require('mongoose');

// environment variables from .env file
require('dotenv').config();

// MongoDB connection string from environment variables
const MONGO_URI = process.env.MONGO_URI;

/**
 * Connects to MongoDB using mongoose.
 * Logs "database connected" upon successful connection.
 * Logs error if connection fails.
 */
const connectDB = () => {
  try {
    mongoose.connect(MONGO_URI)
      .then(() => {
        console.log("database connected");
      });
  } catch (error) {
    console.log(error);
  }
};

module.exports = connectDB;
