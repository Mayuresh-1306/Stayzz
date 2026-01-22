import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import Listing from "./models/listing.js";
import User from "./models/user.js";

const SAMPLE_LISTINGS = [
    {
        title: "Cozy Beachfront Cottage",
        description: "Escape to this charming beachfront cottage for a relaxing getaway. Enjoy stunning ocean views and easy access to the beach.",
        image: {
            url: "https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
            filename: "beachfront"
        },
        price: 1500,
        location: "Malibu, California",
        country: "United States",
        coordinates: { latitude: 34.0259, longitude: -118.6825 },
        amenities: ["WiFi", "Kitchen", "Beach Access", "Parking"]
    },
    {
        title: "Modern Loft in Downtown",
        description: "Stay in the heart of the city in this stylish loft apartment. Experience the vibrant urban lifestyle.",
        image: {
            url: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
            filename: "downtown"
        },
        price: 1200,
        location: "Manhattan, New York",
        country: "United States",
        coordinates: { latitude: 40.7128, longitude: -74.0060 },
        amenities: ["WiFi", "Air Conditioning", "Elevator", "Gym"]
    },
    {
        title: "Mountain Retreat",
        description: "Unplug and unwind in this peaceful mountain cabin surrounded by stunning alpine scenery.",
        image: {
            url: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
            filename: "mountain"
        },
        price: 1000,
        location: "Aspen, Colorado",
        country: "United States",
        coordinates: { latitude: 39.1911, longitude: -106.8175 },
        amenities: ["WiFi", "Fireplace", "Kitchen", "Hot Tub"]
    },
    {
        title: "Historic Villa in Tuscany",
        description: "Experience the charm of Tuscany in this beautifully restored historic villa with vineyards.",
        image: {
            url: "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
            filename: "tuscany"
        },
        price: 2500,
        location: "Florence, Tuscany",
        country: "Italy",
        coordinates: { latitude: 43.7696, longitude: 11.2558 },
        amenities: ["WiFi", "Pool", "Kitchen", "Dining Area"]
    },
    {
        title: "Portland Urban Studio",
        description: "A modern studio in the heart of Portland with easy access to local shops and restaurants.",
        image: {
            url: "https://images.unsplash.com/photo-1520022783265-656218b40543?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
            filename: "portland"
        },
        price: 800,
        location: "Portland, Oregon",
        country: "United States",
        coordinates: { latitude: 45.5152, longitude: -122.6784 },
        amenities: ["WiFi", "Kitchen", "Parking", "Laundry"]
    },
    {
        title: "Tropical Paradise in Cancun",
        description: "Wake up to white sandy beaches and turquoise waters in this beachfront paradise.",
        image: {
            url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
            filename: "cancun"
        },
        price: 2000,
        location: "Cancun, Mexico",
        country: "Mexico",
        coordinates: { latitude: 21.1619, longitude: -86.8515 },
        amenities: ["WiFi", "Beach Access", "Pool", "Restaurant"]
    }
];

async function seedDatabase() {
    try {
        const dbUrl = process.env.MONGODB_URI || process.env.ATLASDB_URL || "mongodb://127.0.0.1:27017/stayzz";

        console.log("Connecting to database...");
        await mongoose.connect(dbUrl, {
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        });
        console.log("✓ Connected to MongoDB");

        // Check if there's at least one user in the database
        let owner = await User.findOne({});

        if (!owner) {
            console.log("⚠ No users found in database. Creating a default owner...");
            // Create a default user if none exists
            owner = new User({
                username: "admin",
                email: "admin@stayzz.com",
            });
            // Set a simple password (Note: In production you'd use proper password hashing)
            await owner.setPassword("admin123");
            await owner.save();
            console.log("✓ Created default owner user");
        }

        console.log(`Using owner: ${owner.username} (${owner._id})`);

        // Clear existing listings
        const existingCount = await Listing.countDocuments();
        console.log(`Found ${existingCount} existing listings`);

        const shouldClear = process.argv.includes('--clear');
        if (shouldClear && existingCount > 0) {
            await Listing.deleteMany({});
            console.log("✓ Cleared existing listings");
        }

        // Only seed if database is empty or --force flag is used
        const currentCount = await Listing.countDocuments();
        if (currentCount > 0 && !process.argv.includes('--force')) {
            console.log(`⚠ Database already has ${currentCount} listings. Use --force to override or --clear to clear first.`);
            process.exit(0);
        }

        // Insert sample listings
        console.log("Seeding sample listings...");
        for (const listingData of SAMPLE_LISTINGS) {
            const listing = new Listing({
                ...listingData,
                owner: owner._id
            });
            await listing.save();
            console.log(`✓ Created: ${listing.title}`);
        }

        console.log(`\n✓ Successfully seeded ${SAMPLE_LISTINGS.length} listings!`);
        process.exit(0);
    } catch (error) {
        console.error("✗ Seeding failed:", error);
        process.exit(1);
    }
}

seedDatabase();
