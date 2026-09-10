const mongoose = require("mongoose");

// Connects to MongoDB Atlas using the URI from .env
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    process.exit(1); // Stop the server if DB connection fails
  }
};

module.exports = connectDB;
