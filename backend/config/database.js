import mongoose from "mongoose";
import dns from "dns";

dns.setServers(["8.8.8.8", "8.8.4.4", "1.1.1.1"]);

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

export { connectDB, dbUrl };
