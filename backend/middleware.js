const jwt = require("jsonwebtoken");
const Listing = require("./models/listing");
const Review = require("./models/review");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("./schema.js");

// JWT Authentication Middleware
module.exports.verifyToken = (req, res, next) => {
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

module.exports.isloggedIn = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ error: "You must be logged in" });
    }
    next();
};

module.exports.isOwner = async (req, res, next) => {
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

module.exports.validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    if (error) {
        throw new ExpressError(400, error.details[0].message);
    } else {
        next();
    }
};

module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(",");
        throw new ExpressError(400, msg);
    } else {
        next();
    }
};

module.exports.isReviewAuthor = async(req, res, next) => {
  let {id, reviewId } = req.params;
  let review = await Review.findById(reviewId);
  if(!review.author.equals(res.locals.currUser._id)) {
    req.flash("error", "you are not the author of this listing");
    return res.redirect(`/listings/${id}`);
  }

  next();
};
