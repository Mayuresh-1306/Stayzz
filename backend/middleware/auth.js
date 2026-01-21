const jwt = require("jsonwebtoken");
const Listing = require("../models/listing");
const Review = require("../models/review");

/**
 * Verify JWT Token from request headers
 */
const verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        return res.status(401).json({ error: "No token, authorization denied" });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ error: "Token is not valid" });
    }
};

/**
 * Check if user is logged in
 */
const isLoggedIn = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ error: "You must be logged in" });
    }
    next();
};

/**
 * Check if user is the owner of a listing
 */
const isOwner = async (req, res, next) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if (!listing) {
        return res.status(404).json({ error: "Listing not found" });
    }
    if (!listing.owner.equals(req.user.id)) {
        return res.status(403).json({ error: "You are not the owner of this listing" });
    }
    next();
};

/**
 * Check if user is the author of a review
 */
const isReviewAuthor = async (req, res, next) => {
    let { id, reviewId } = req.params;
    let review = await Review.findById(reviewId);
    if (!review.author.equals(req.user._id)) {
        return res.status(403).json({ error: "You are not the author of this review" });
    }
    next();
};

module.exports = {
    verifyToken,
    isLoggedIn,
    isOwner,
    isReviewAuthor,
};
