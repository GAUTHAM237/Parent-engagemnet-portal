const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const envPath = path.resolve(__dirname, ".env");
console.log("Absolute path to .env:", envPath);

require("dotenv").config({ path: envPath });

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Debug: Check if environment variables are loaded
console.log("Environment Variables Loaded:", {
  port: process.env.PORT,
  mongoUri: process.env.MONGODB_URI ? "Defined" : "Undefined",
  jwtSecret: process.env.JWT_SECRET ? "Defined" : "Undefined",
});

// Debug MongoDB URI
console.log("Attempting to connect to MongoDB...");
console.log(
  "MongoDB URI format check:",
  process.env.MONGODB_URI?.startsWith("mongodb+srv://")
);

// MongoDB Connection with error handling
if (!process.env.MONGODB_URI) {
  console.error("MONGODB_URI is not defined in environment variables");
  process.exit(1);
}

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("MongoDB Connected Successfully");
  })
  .catch((err) => {
    console.error("MongoDB connection error details:", {
      message: err.message,
      code: err.code,
      name: err.name,
    });
    process.exit(1);
  });

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/messages", require("./routes/messages"));
app.use("/api/notifications", require("./routes/notifications"));
app.use("/api/resources", require("./routes/resources"));
app.use("/api/progress", require("./routes/progress"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
