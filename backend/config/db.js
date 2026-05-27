const mongoose = require('mongoose');

const connectDB = async () => {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.error('MONGO_URI not set in environment');
    process.exit(1);
  }

  const opts = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
  };

  const maxRetries = parseInt(process.env.DB_CONNECT_RETRIES || '5', 10);
  let attempts = 0;

  while (attempts < maxRetries) {
    try {
      await mongoose.connect(uri, opts);
      console.log('MongoDB connected');
      mongoose.connection.on('error', (err) => {
        console.error('MongoDB connection error:', err);
      });
      mongoose.connection.on('disconnected', () => {
        console.warn('MongoDB disconnected');
      });
      return mongoose.connection;
    } catch (err) {
      attempts += 1;
      console.error(`MongoDB connection attempt ${attempts} failed:`, err.message);
      if (attempts >= maxRetries) {
        console.error('Max MongoDB connection attempts reached. Exiting.');
        process.exit(1);
      }
      const backoff = 500 * attempts;
      await new Promise((r) => setTimeout(r, backoff));
    }
  }
};

module.exports = connectDB;
