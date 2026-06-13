const mongoose = require('mongoose');

const connectDatabase = async (uri) => {
  try {
    await mongoose.connect(uri);
    console.log('MongoDB successfully connected.');
  } catch (error) {
    console.error('Database connection failed:', error.message);
    process.exit(1);
  }
};

module.exports = { connectDatabase };
