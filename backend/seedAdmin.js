const mongoose = require("mongoose");
const Admin = require("./models/Admin");
require("dotenv").config();

mongoose
  .connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/portfolioDB")
  .then(async () => {
    console.log("Connected to MongoDB for Seeding");

    const targetUsername = "nilesh@gmail.com";
    const targetPassword = "123123";

    // Check if exists
    const existing = await Admin.findOne({ username: targetUsername });
    if (existing) {
      existing.password = targetPassword;
      await existing.save();
      console.log("Updated existing admin user:", targetUsername);
    } else {
      await Admin.create({
        username: targetUsername,
        password: targetPassword,
      });
      console.log("Created new admin user:", targetUsername);
    }
    await mongoose.connection.close();
    process.exit();
  })
  .catch((err) => {
    console.error("Database connection error:", err);
    process.exit(1);
  });
