import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import Listing from "./models/listing.js";
import User from "./models/user.js";

const dbUrl = process.env.MONGODB_URI || process.env.ATLASDB_URL || "mongodb://127.0.0.1:27017/stayzz";

const sampleListings = [
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
        amenities: ["WiFi", "Kitchen", "Beach Access", "Parking"],
        reviews: []
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
        amenities: ["WiFi", "Air Conditioning", "Elevator", "Gym"],
        reviews: []
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
        amenities: ["WiFi", "Fireplace", "Kitchen", "Hot Tub"],
        reviews: []
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
        amenities: ["WiFi", "Pool", "Kitchen", "Dining Area"],
        reviews: []
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
        amenities: ["WiFi", "Kitchen", "Parking", "Laundry"],
        reviews: []
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
        amenities: ["WiFi", "Beach Access", "Pool", "Restaurant"],
        reviews: []
    },
    {
        title: "Lakeside Cabin Retreat",
        description: "Peaceful lakeside cabin perfect for a weekend getaway. Enjoy fishing, kayaking, and nature trails.",
        image: {
            url: "https://images.unsplash.com/photo-1464146072230-91cabc968266?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
            filename: "lakeside"
        },
        price: 950,
        location: "Lake Tahoe, California",
        country: "United States",
        coordinates: { latitude: 39.0968, longitude: -120.0324 },
        amenities: ["WiFi", "Fireplace", "Kitchen", "Kayaks"],
        reviews: []
    },
    {
        title: "Luxury Penthouse Suite",
        description: "Experience luxury living in this stunning penthouse with panoramic city views and premium amenities.",
        image: {
            url: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
            filename: "penthouse"
        },
        price: 3500,
        location: "Dubai Marina",
        country: "United Arab Emirates",
        coordinates: { latitude: 25.0801, longitude: 55.1392 },
        amenities: ["WiFi", "Pool", "Gym", "Concierge"],
        reviews: []
    }
];

async function seedListings() {
    try {
        console.log("🔌 Connecting to database...");
        await mongoose.connect(dbUrl);
        console.log("✅ Connected to MongoDB");

        // Find a user to assign as owner (or create a demo user)
        let demoUser = await User.findOne({ email: "demo@stayzz.com" });

        if (!demoUser) {
            console.log("👤 Creating demo user...");
            demoUser = new User({
                username: "DemoUser",
                email: "demo@stayzz.com",
                password: "Demo@2024" // Will be hashed by the pre-save hook
            });
            await demoUser.save();
            console.log("✅ Demo user created");
        }

        // Delete existing sample listings (optional - comment out if you want to keep existing)
        console.log("🗑️  Clearing old sample listings...");
        await Listing.deleteMany({ owner: demoUser._id });

        // Insert new listings
        console.log("📝 Creating sample listings...");
        const listings = sampleListings.map(listing => ({
            ...listing,
            owner: demoUser._id
        }));

        const result = await Listing.insertMany(listings);

        console.log(`✅ Successfully created ${result.length} sample listings!`);
        console.log("\nListings:");
        result.forEach((listing, index) => {
            console.log(`  ${index + 1}. ${listing.title} (ID: ${listing._id})`);
        });

        console.log("\n🎉 Database seeding completed!");

    } catch (error) {
        console.error("❌ Error seeding database:", error);
    } finally {
        await mongoose.connection.close();
        console.log("🔌 Database connection closed");
        process.exit(0);
    }
}

seedListings();
