import apiClient from './apiConfig';

/**
 * Fetch all listings
 * @returns {Promise} Array of listings
 */
export const getAllListings = async () => {
    const response = await apiClient.get('/api/listings');
    return response.data;
};

/**
 * Fetch a single listing by ID
 * @param {string} id - Listing ID
 * @returns {Promise} Listing details
 */
export const getListingById = async (id) => {
    const response = await apiClient.get(`/api/listings/${id}`);
    return response.data;
};

/**
 * Create a new listing
 * @param {FormData} formData - Form data with listing details and image
 * @returns {Promise} Created listing
 */
export const createListing = async (formData) => {
    const response = await apiClient.post('/api/listings', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};

/**
 * Update an existing listing
 * @param {string} id - Listing ID
 * @param {FormData} formData - Form data with updated listing details
 * @returns {Promise} Updated listing
 */
export const updateListing = async (id, formData) => {
    const response = await apiClient.put(`/api/listings/${id}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};

/**
 * Delete a listing
 * @param {string} id - Listing ID
 * @returns {Promise} Deletion confirmation
 */
export const deleteListing = async (id) => {
    const response = await apiClient.delete(`/api/listings/${id}`);
    return response.data;
};

/**
 * Search listings by location
 * @param {string} location - Location to search for
 * @returns {Promise} Filtered listings
 */
export const searchListings = async (location) => {
    const response = await apiClient.get('/api/listings', {
        params: { location },
    });
    return response.data;
};
