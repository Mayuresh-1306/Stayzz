import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Listing from './models/listing.js';
import User from './models/user.js';

dotenv.config();

const DUMMY_LISTINGS = [
  {
    title: "Cozy Beachfront Cottage",
    description: "Escape to this charming beachfront cottage for a relaxing getaway. Enjoy stunning ocean views.",
    image: { url: "https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60", filename: "beach" },
    price: 1500,
    location: "Malibu",
    country: "USA",
    coordinates: { latitude: 34.0259, longitude: -118.6825 },
    amenities: ["WiFi", "Kitchen", "Beach Access"]
  },
  {
    title: "Modern Downtown Loft",
    description: "Stay in the heart of the city in this stylish apartment.",
    image: { url: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60", filename: "loft" },
    price: 1200,
    location: "Manhattan",
    country: "USA",
    coordinates: { latitude: 40.7128, longitude: -74.0060 },
    amenities: ["WiFi", "AC", "Gym"]
  },
  {
    title: "Mountain Retreat Cabin",
    description: "Peaceful mountain cabin with stunning views.",
    image: { url: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60", filename: "mountain" },
    price: 1000,
    location: "Aspen",
    country: "USA",
    coordinates: { latitude: 39.1911, longitude: -106.8175 },
    amenities: ["WiFi", "Fireplace", "Kitchen"]
  },
  {
    title: "Tuscany Villa",
    description: "Historic villa in beautiful Tuscany.",
    image: { url: "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60", filename: "tuscany" },
    price: 2500,
    location: "Florence",
    country: "Italy",
    coordinates: { latitude: 43.7696, longitude: 11.2558 },
    amenities: ["WiFi", "Pool", "Kitchen"]
  },
  {
    title: "Portland Urban Studio",
    description: "Modern studio in Portland city center.",
    image: { url: "https://images.unsplash.com/photo-1520022783265-656218b40543?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60", filename: "portland" },
    price: 800,
    location: "Portland",
    country: "USA",
    coordinates: { latitude: 45.5152, longitude: -122.6784 },
    amenities: ["WiFi", "Parking", "Laundry"]
  },
  {
    title: "Cancun Beach Paradise",
    description: "Beachfront property with turquoise waters.",
    image: { url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60", filename: "cancun" },
    price: 2000,
    location: "Cancun",
    country: "Mexico",
    coordinates: { latitude: 21.1619, longitude: -86.8515 },
    amenities: ["WiFi", "Beach", "Pool"]
  }
];

async function insertListings() {
  try {
    const dbUrl = process.env.MONGODB_URI || process.env.ATLASDB_URL;
    await mongoose.connect(dbUrl);
    console.log('✓ Connected to MongoDB');

    let demoUser = await User.findOne({ username: 'demo' });
    if (!demoUser) {
      demoUser = new User({ username: 'demo', email: 'demo@example.com', password: 'demo123' });
      await demoUser.save();
      console.log('✓ Created demo user');
    }

    const listingsWithOwner = DUMMY_LISTINGS.map(listing => ({
      ...listing,
      owner: demoUser._id
    }));

    await Listing.deleteMany({});
    console.log('🗑️ Cleared existing listings');

    const result = await Listing.insertMany(listingsWithOwner);
    console.log(`✅ Inserted ${result.length} dummy listings`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

insertListings();
