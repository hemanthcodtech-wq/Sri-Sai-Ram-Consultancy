const mongoose = require('mongoose');
const store = require('./store');

// ─── Connection cache (survives warm Vercel invocations) ─────────────────────
// Vercel serverless functions reuse the same Node.js process for warm starts.
// Caching the connection prevents a new TLS handshake on every request.
let cached = global._mongooseCache;
if (!cached) {
  cached = global._mongooseCache = { conn: null, promise: null };
}

const connectDB = async () => {
  // Already connected — reuse without any overhead
  if (cached.conn) {
    store.setMongoConnected(true);
    return cached.conn;
  }

  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    store.setMongoConnected(false);
    console.log('ℹ️ MONGO_URI not set. Running with in-memory data store.');
    return null;
  }

  // If a connection is already in progress, wait for it (prevents duplicate connections)
  if (!cached.promise) {
    cached.promise = mongoose
      .connect(mongoUri, {
        serverSelectionTimeoutMS: 15000,
        connectTimeoutMS: 15000,
        socketTimeoutMS: 45000,
        maxPoolSize: 10,
        minPoolSize: 1,
      })
      .then((conn) => {
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
        store.setMongoConnected(true);
        return conn;
      })
      .catch((error) => {
        cached.promise = null; // allow retry on next request
        store.setMongoConnected(false);
        console.log(`ℹ️ Running with built-in in-memory data store (${error.message}). To use MongoDB, ensure mongod service is started or set MONGO_URI in .env.`);
        return null;
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch {
    cached.promise = null;
    cached.conn = null;
    store.setMongoConnected(false);
  }

  return cached.conn;
};

module.exports = connectDB;
