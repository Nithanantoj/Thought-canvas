const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();  // Load environment variables from .env

const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI;  // Get the MongoDB URI from the environment variable

    if (!uri) {
      throw new Error('MongoDB URI is not defined in the .env file');
    }

    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('MongoDB connected');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
    process.exit(1);  // Exit the process if connection fails
  }
};

module.exports = connectDB;
