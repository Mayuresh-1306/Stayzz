if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("express-async-errors");

const app = express();

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:3000",
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database Connection
const dbUrl = process.env.MONGODB_URI || process.env.ATLASDB_URL || "mongodb://127.0.0.1:27017/stayzz";

async function connectDB() {
  try {
    await mongoose.connect(dbUrl, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    console.log("✓ Connected to MongoDB");
  } catch (err) {
    console.error("✗ Database connection failed:", err.message);
    console.log("⚠ Server continuing without database. Retrying connection...");
    setTimeout(connectDB, 5000); // Retry after 5 seconds
  }
}

connectDB();

// Routes
app.use("/api/listings", require("./routes/listing.js"));
app.use("/api/reviews", require("./routes/review.js"));
app.use("/api/users", require("./routes/user.js"));

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "Backend is running", timestamp: new Date() });
});

// Test endpoint to check database
app.get("/api/test", async (req, res) => {
  try {
    const collections = await mongoose.connection.db.listCollections().toArray();
    res.json({ 
      status: "Connected to database",
      database: mongoose.connection.name,
      collections: collections.map(c => c.name)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err);
  const status = err.status || 500;
  const message = err.message || "Something went wrong";
  res.status(status).json({ error: message });
});

const PORT = process.env.PORT || 5002;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
