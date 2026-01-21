import dotenv from "dotenv";
if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}

process.env.JWT_SECRET = process.env.JWT_SECRET || "your-super-secret-jwt-key-change-this-in-production";

import dns from "dns";
dns.setServers(["8.8.8.8", "8.8.4.4", "1.1.1.1"]);

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import "express-async-errors";

import listingRouter from "./routes/listing.js";
import reviewRouter from "./routes/review.js";
import userRouter from "./routes/user.js";

const app = express();

app.use(cors({
  origin: [process.env.CLIENT_URL, "http://localhost:3000", "https://stayzz-1olr.onrender.com"].filter(Boolean),
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
    setTimeout(connectDB, 5000);
  }
}

connectDB();

app.use("/api/listings", listingRouter);
app.use("/api/reviews", reviewRouter);
app.use("/api/users", userRouter);

app.get("/api/health", (req, res) => {
  res.json({ status: "Backend is running", timestamp: new Date() });
});

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

app.use((err, req, res, next) => {
  console.error(err);
  const status = err.status || 500;
  const message = err.message || "Something went wrong";
  res.status(status).json({ error: message });
});

const PORT = process.env.PORT || 5003;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
