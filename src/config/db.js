const mongoose = require('mongoose');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI;

const connectDB = () => {
  try {
    mongoose.connect(MONGO_URI)
    .then( () => {
      console.log("database connected");
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports = connectDB;