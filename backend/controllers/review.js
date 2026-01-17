const Listing = require("../models/listing");
const Review = require("../models/review");

module.exports.createReview = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  
  if (!listing) {
    return res.status(404).json({ error: "Listing not found" });
  }

  const newReview = new Review(req.body.review);
  newReview.author = req.user._id;
  
  listing.reviews.push(newReview);
  
  await newReview.save();
  await listing.save();
  
  res.status(201).json({ success: true, review: newReview, message: "Review created successfully" });
};

module.exports.destroyReview = async (req, res) => {
  const { id, reviewId } = req.params;
  
  const result = await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } }, { new: true });
  await Review.findByIdAndDelete(reviewId);
  
  res.json({ success: true, message: "Review deleted successfully" });
};

module.exports.getReviews = async (req, res) => {
  const { listingId } = req.query;
  
  if (!listingId) {
    return res.status(400).json({ error: "listingId is required" });
  }

  try {
    const listing = await Listing.findById(listingId).populate({
      path: "reviews",
      populate: {
        path: "author"
      }
    });

    if (!listing) {
      return res.status(404).json({ error: "Listing not found" });
    }

    res.json(listing.reviews || []);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch reviews" });
  }
}; 