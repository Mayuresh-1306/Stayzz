const mongoose = require("mongoose");
const initdata = require("./data.js");
const Listing = require("../models/listing.js");
const User = require("../models/user.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/stayzz";

async function main() {
  await mongoose.connect(MONGO_URL);
  console.log("Connected to DB");
}

const initDB = async () => {
  try {
    // 1. Create a demo user if not exists
    let demoUser = await User.findOne({ username: 'demo' });
    if (!demoUser) {
      demoUser = new User({
        username: 'demo',
        email: 'demo@example.com',
        password: 'demo123'
      });
      await demoUser.save();
      console.log("✓ Created demo user");
    }

    // 2. Clear existing data so we don't get duplicates
    await Listing.deleteMany({});
    console.log("🗑️  Cleared existing listings");

    // 3. Add the 'owner' field to every listing object using the demo user ID
    const listingsWithOwner = initdata.data.map((obj) => ({
      ...obj,
      owner: demoUser._id,
    }));

    // 4. Insert the modified data
    const result = await Listing.insertMany(listingsWithOwner);
    console.log(`✅ Successfully inserted ${result.length} listings`);

  } catch (err) {
    console.error("❌ Seeding failed:", err);
    process.exit(1);
  }
};

// Run the initialization
main()
  .then(() => initDB())
  .catch((err) => {
    console.error("Initialization error:", err);
    process.exit(1);
  })
  .finally(() => {
    mongoose.connection.close();
    console.log("DB connection closed");
  });