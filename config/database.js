const mongoose = require('mongoose');

async function connectDatabase() {
  if (!process.env.MONGODB_URI) {
    console.warn('MONGODB_URI is not configured. Using in-memory demo storage.');
    return false;
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected.');
    return true;
  } catch (error) {
    console.warn(`MongoDB connection failed: ${error.message}`);
    console.warn('Continuing with in-memory demo storage.');
    return false;
  }
}

module.exports = { connectDatabase };