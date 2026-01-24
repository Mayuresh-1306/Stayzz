import Listing from "../models/listing.js";
import mongoose from "mongoose";

export const index = async (req, res) => {
  try {
    const allListings = await Listing.find({}).populate("owner");
    res.json(allListings);
  } catch (error) {
    console.error("Error fetching listings:", error.message);
    res.status(500).json({ error: "Failed to fetch listings" });
  }
};

export const renderNewForm = (req, res) => {
  res.json({ message: "Create new listing" });
};

export const showListing = async (req, res) => {
  let { id } = req.params;

  // Validate ObjectId format
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid listing ID format" });
  }

  try {
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

    return res.json(listing);
  } catch (error) {
    console.error("Error fetching listing:", error.message);
    return res.status(500).json({ error: "Failed to fetch listing" });
  }
};

export const createListing = async (req, res, next) => {
  if (!req.user || !req.user.id) {
    return res.status(401).json({ error: "Authentication required" });
  }

  console.log("📝 Creating new listing...");
  console.log("File uploaded:", req.file ? "Yes" : "No");
  if (req.file) {
    console.log("File details:", {
      filename: req.file.filename,
      path: req.file.path,
      originalname: req.file.originalname
    });
  }

  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user.id;

  if (req.file) {
    newListing.image = {
      url: req.file.path || `/uploads/${req.file.filename}`,
      filename: req.file.filename
    };
    console.log("✅ Image assigned:", newListing.image);
  } else {
    newListing.image = {
      url: "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
      filename: "default"
    };
    console.log("⚠️  No file uploaded, using default image");
  }

  if (!newListing.coordinates) {
    newListing.coordinates = {
      latitude: 20.5937,
      longitude: 78.9629
    };
  }

  await newListing.save();
  console.log("💾 Listing saved with image:", newListing.image.url);

  res.status(201).json({ success: true, listing: newListing, message: "New Listing Created!" });
};

export const renderEditForm = async (req, res) => {
  let { id } = req.params;

  // Validate ObjectId format
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid listing ID format" });
  }

  const listing = await Listing.findById(id);
  if (!listing) {
    return res.status(404).json({ error: "Listing not found" });
  }
  res.json(listing);
};

export const updateListing = async (req, res) => {
  let { id } = req.params;

  // Validate ObjectId format
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid listing ID format" });
  }

  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing }, { new: true });

  if (!listing) {
    return res.status(404).json({ error: "Listing not found" });
  }

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

  // Validate ObjectId format
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid listing ID format" });
  }

  let deletedListing = await Listing.findByIdAndDelete(id);

  if (!deletedListing) {
    return res.status(404).json({ error: "Listing not found" });
  }

  res.json({ success: true, message: "Listing Deleted!", listing: deletedListing });
};
