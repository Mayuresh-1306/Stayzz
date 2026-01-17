const Listing = require("../models/listing");

// Sample data for fallback when database is not connected
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

module.exports.index = async (req, res) => {
  try {
    const allListings = await Listing.find({}).populate("owner");
    res.json(allListings);
  } catch (error) {
    // Return sample data if database is not connected
    console.log("Using fallback sample data due to:", error.message);
    res.json(SAMPLE_LISTINGS);
  }
};

module.exports.renderNewForm = (req, res) => {
   res.json({ message: "Create new listing" });
};

module.exports.showListing = async (req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id)
    .populate({
        path: "reviews",
        populate: {
            path: "author",
        },
    })
    .populate("owner");
    if (!listing) {
        return res.status(404).json({ error: "Listing not found" });
    }
    res.json(listing);
};

module.exports.createListing = async (req, res, next) => {
  let url = req.file.path;
  let filename = req.file.filename;
 
  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  newListing.image = {url, filename};
  
  // Set default coordinates if not provided
  if (!newListing.coordinates) {
    newListing.coordinates = {
      latitude: 20.5937,
      longitude: 78.9629
    };
  }
  
  await newListing.save();
  res.status(201).json({ success: true, listing: newListing, message: "New Listing Created!" });
};

module.exports.renderEditForm = async (req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
      return res.status(404).json({ error: "Listing not found" });
    }
    res.json(listing);
};

module.exports.updateListing = async (req, res) => {
   
    let {id} = req.params;

   let listing = await Listing.findByIdAndUpdate(id, {...req.body.listing}, { new: true });
   
   if(typeof req.file != "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = {url, filename};
    await listing.save();
   }

   res.json({ success: true, listing: listing, message: "Listing Updated!" });
};

module.exports.destroyListing = async (req, res)=> {
   let {id} = req.params;
   let deletedListing = await Listing.findByIdAndDelete(id);
   res.json({ success: true, message: "Listing Deleted!", listing: deletedListing });
    req.flash("success", "Listing Deleted!");
   res.redirect("/listings");
   };