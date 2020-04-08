const mongoose = require("mongoose");
require("dotenv").config();

const DATABASE_URI = process.env.DATABASE_URI;

const connectDB = async () => {
  try {
    await mongoose.connect(DATABASE_URI, {
      useCreateIndex: true,
      useFindAndModify: false,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`Database connection successful...`);
  } catch (err) {
    console.log(`Error connecting to database: ${err.message}...`);
  }
};

module.exports = connectDB;
