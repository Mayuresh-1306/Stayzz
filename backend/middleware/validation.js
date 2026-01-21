const ExpressError = require("../utils/ExpressError");
const { listingSchema, reviewSchema } = require("../validators/schemas");

/**
 * Validate listing data using Joi schema
 */
const validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    if (error) {
        throw new ExpressError(400, error.details[0].message);
    } else {
        next();
    }
};

/**
 * Validate review data using Joi schema
 */
const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(",");
        throw new ExpressError(400, msg);
    } else {
        next();
    }
};

module.exports = {
    validateListing,
    validateReview,
};
