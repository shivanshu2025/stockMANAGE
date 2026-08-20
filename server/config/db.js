const mongoose = require('mongoose');

const connectDB = async () => {
  const uri = process.env.MONGO_URI;

  if (!uri) {
    throw new Error('MONGO_URI is not defined in server/.env');
  }

  try {
    await mongoose.connect(uri);
  } catch (error) {
    console.error('✗ MongoDB connection failed:', error.message);
    console.error('  Check MONGO_URI in server/.env and try again.');
    process.exit(1);
  }
};

module.exports = connectDB;
