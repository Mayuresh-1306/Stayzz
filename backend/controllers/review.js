import Listing from "../models/listing.js";
import Review from "../models/review.js";

export const createReview = async (req, res) => {
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

  // Populate author information before sending response
  await newReview.populate('author');

  res.status(201).json({ success: true, review: newReview, message: "Review created successfully" });
};

export const destroyReview = async (req, res) => {
  const { id, reviewId } = req.params;

  const result = await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } }, { new: true });
  await Review.findByIdAndDelete(reviewId);

  res.json({ success: true, message: "Review deleted successfully" });
};

export const getReviews = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: "Listing ID is required" });
  }

  try {
    const listing = await Listing.findById(id).populate({
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