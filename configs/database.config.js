const mongoose = require("mongoose");

module.exports.connectDB = async () => {
  try {
    await mongoose.connect(process.env.DATABASE);
    console.log("Database connected successfully");
  } catch (error) {
    console.error("Database connection error:", error);
  }
};
