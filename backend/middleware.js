import jwt from "jsonwebtoken";
import Listing from "./models/listing.js";
import Review from "./models/review.js";
import ExpressError from "./utils/ExpressError.js";
import { listingSchema, reviewSchema } from "./schema.js";

export const verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        return res.status(401).json({ error: "No token, authorization denied" });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        console.error("JWT Verification Error:", error.message);
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ error: "Token has expired, please login again" });
        }
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ error: "Invalid token format" });
        }
        return res.status(401).json({ error: "Token is not valid" });
    }
};

export const isLoggedIn = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ error: "You must be logged in" });
    }
    next();
};

export const isOwner = async (req, res, next) => {
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

export const validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    if (error) {
        throw new ExpressError(400, error.details[0].message);
    } else {
        next();
    }
};

export const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(",");
        throw new ExpressError(400, msg);
    } else {
        next();
    }
};

export const isReviewAuthor = async (req, res, next) => {
    let { id, reviewId } = req.params;
    let review = await Review.findById(reviewId);
    if (!review.author.equals(req.user._id)) {
        return res.status(403).json({ error: "You are not the author of this review" });
    }

    next();
};
