import Listing from "../models/listing.js";

const SAMPLE_LISTINGS = [
  {
    _id: "sample1",
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
    _id: "sample2",
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
    _id: "sample3",
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
    _id: "sample4",
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
    _id: "sample5",
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
    _id: "sample6",
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
  }
];

export const index = async (req, res) => {
  try {
    const allListings = await Listing.find({}).populate("owner");
    if (allListings.length === 0) {
      console.log("No listings in database, using sample data");
      res.json(SAMPLE_LISTINGS);
    } else {
      res.json(allListings);
    }
  } catch (error) {
    console.log("Using fallback sample data due to:", error.message);
    res.json(SAMPLE_LISTINGS);
  }
};

export const renderNewForm = (req, res) => {
  res.json({ message: "Create new listing" });
};

export const showListing = async (req, res) => {
  let { id } = req.params;

  try {
    const listing = await Listing.findById(id)
      .populate({
        path: "reviews",
        populate: {
          path: "author",
        },
      })
      .populate("owner");

    if (listing) {
      return res.json(listing);
    }
  } catch (error) {
    console.log("Database lookup failed, checking sample data:", error.message);
  }

  // Fallback to sample data
  const sampleListing = SAMPLE_LISTINGS.find(l => l._id === id);
  if (sampleListing) {
    console.log("Using sample listing for id:", id);
    return res.json(sampleListing);
  }

  return res.status(404).json({ error: "Listing not found" });
};

export const createListing = async (req, res, next) => {
  if (!req.user || !req.user.id) {
    return res.status(401).json({ error: "Authentication required" });
  }
  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user.id;

  if (req.file) {
    newListing.image = {
      url: req.file.path || `/uploads/${req.file.filename}`,
      filename: req.file.filename
    };
  } else {
    newListing.image = {
      url: "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
      filename: "default"
    };
  }

  if (!newListing.coordinates) {
    newListing.coordinates = {
      latitude: 20.5937,
      longitude: 78.9629
    };
  }

  await newListing.save();
  res.status(201).json({ success: true, listing: newListing, message: "New Listing Created!" });
};

export const renderEditForm = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    return res.status(404).json({ error: "Listing not found" });
  }
  res.json(listing);
};

export const updateListing = async (req, res) => {

  let { id } = req.params;

  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing }, { new: true });

  if (req.file) {
    listing.image = {
      url: req.file.path || `/uploads/${req.file.filename}`,
      filename: req.file.filename
    };
    await listing.save();
  }

  res.json({ success: true, listing: listing, message: "Listing Updated!" });
};

export const destroyListing = async (req, res) => {
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  res.json({ success: true, message: "Listing Deleted!", listing: deletedListing });
};
