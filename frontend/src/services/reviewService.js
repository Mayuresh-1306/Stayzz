import apiClient from './apiConfig';

/**
 * Get all reviews for a specific listing
 * @param {string} listingId - Listing ID
 * @returns {Promise} Array of reviews
 */
export const getReviewsForListing = async (listingId) => {
    const response = await apiClient.get(`/api/reviews/${listingId}`);
    return response.data;
};

/**
 * Create a new review for a listing
 * @param {string} listingId - Listing ID
 * @param {Object} reviewData - Review data (rating, comment)
 * @returns {Promise} Created review
 */
export const createReview = async (listingId, reviewData) => {
    const response = await apiClient.post(`/api/reviews/${listingId}`, reviewData);
    return response.data;
};

/**
 * Update an existing review
 * @param {string} listingId - Listing ID
 * @param {string} reviewId - Review ID
 * @param {Object} reviewData - Updated review data
 * @returns {Promise} Updated review
 */
export const updateReview = async (listingId, reviewId, reviewData) => {
    const response = await apiClient.put(`/api/reviews/${listingId}/${reviewId}`, reviewData);
    return response.data;
};

/**
 * Delete a review
 * @param {string} listingId - Listing ID
 * @param {string} reviewId - Review ID
 * @returns {Promise} Deletion confirmation
 */
export const deleteReview = async (listingId, reviewId) => {
    const response = await apiClient.delete(`/api/reviews/${listingId}/${reviewId}`);
    return response.data;
};
