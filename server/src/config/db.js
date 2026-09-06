const mongoose = require('mongoose');
const store = require('./store');

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/ssrc_db';
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 2500,
    });
    store.setMongoConnected(true);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    store.setMongoConnected(false);
    console.log(`ℹ️ Running with built-in in-memory data store (${error.message}). To use MongoDB, ensure mongod service is started or set MONGO_URI in .env.`);
  }
};

module.exports = connectDB;
