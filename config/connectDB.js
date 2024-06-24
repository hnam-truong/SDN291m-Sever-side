const mongoose = require("mongoose");

let connectDB = () => {
  mongoose.connect("mongodb://localhost:27017/watchAssignment").then(() => {
    console.log("🟢 Connected to DB successfully!");
  });
};

module.exports = connectDB;
