const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const {validateReview, isloggedIn, isReviewAuthor, verifyToken} = require("../middleware.js");
const reviewController = require("../controllers/review.js");

// Get all reviews for a listing
router.get("/", wrapAsync(reviewController.getReviews));

// Create a new review
router.post("/", verifyToken, isloggedIn, validateReview, wrapAsync(reviewController.createReview));

// Delete a review
router.delete("/:reviewId", verifyToken, isloggedIn, isReviewAuthor, wrapAsync(reviewController.destroyReview));

module.exports = router;