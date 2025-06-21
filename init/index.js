const mongoose = require("mongoose");
const initdata = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

async function main() {
  await mongoose.connect(MONGO_URL);
  console.log("Connected to DB");
}

const initDB = async () => {
  try {
   
    
    console.log("First listing to insert:", initdata.data[0]);
    
   
    const result = await Listing.insertMany(initdata.data);
    console.log(`✅ Successfully inserted ${result.length} listings`);
  } catch (err) {
    console.error("❌ Seeding failed:", err);
    process.exit(1);
  }
};


// Run the initialization
main()
  .then(() => initDB())
  .catch(err => {
    console.error("Initialization error:", err);
    process.exit(1);
  })
  .finally(() => {
    mongoose.connection.close();
    console.log("DB connection closed");
  });

// const initDB = async () => {
//   await Listing.deletMany({});
//   initdata.data = initdata.data.map((obj) => ({...obj, owner: "68546aa46fee67206602954d" }));
//   await Listing.insertMany(initdata.data);
//   console.log("data was initialized");
//   };

//   initDB();
