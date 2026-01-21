/**
 * Middleware Index
 * Central export point for all middleware modules
 */
const { verifyToken, isLoggedIn, isOwner, isReviewAuthor } = require('./auth');
const { validateListing, validateReview } = require('./validation');
const errorHandler = require('./errorHandler');

module.exports = {
    // Authentication & Authorization
    verifyToken,
    isLoggedIn,
    isOwner,
    isReviewAuthor,

    // Validation
    validateListing,
    validateReview,

    // Error Handling
    errorHandler,
};
