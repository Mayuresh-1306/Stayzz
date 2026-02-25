import apiClient from './apiConfig';

/**
 * Check if dates are available for a listing (Interval Tree search).
 * @param {string} listingId
 * @param {string} startDate  ISO date string
 * @param {string} endDate    ISO date string
 * @returns {Promise<{ available: boolean, conflict?: object, algorithm: object }>}
 */
export const checkAvailability = async (listingId, startDate, endDate) => {
    const response = await apiClient.post(
        `/api/listings/${listingId}/bookings/check`,
        { startDate, endDate }
    );
    return response.data;
};

/**
 * Create a new booking (only succeeds if Interval Tree finds no conflict).
 * @param {string} listingId
 * @param {string} startDate  ISO date string
 * @param {string} endDate    ISO date string
 * @param {number} guests
 * @returns {Promise<{ success: boolean, booking: object, priceBreakdown: object }>}
 */
export const createBooking = async (listingId, startDate, endDate, guests = 1) => {
    const response = await apiClient.post(
        `/api/listings/${listingId}/bookings`,
        { booking: { listingId, startDate, endDate, guests } }
    );
    return response.data;
};

/**
 * Fetch all confirmed bookings for a listing.
 * @param {string} listingId
 * @returns {Promise<{ bookings: Array, count: number }>}
 */
export const getBookings = async (listingId) => {
    const response = await apiClient.get(`/api/listings/${listingId}/bookings`);
    return response.data;
};

/**
 * Fetch all bookings for the currently logged-in user (upcoming, past, cancelled).
 * @returns {Promise<{ upcoming: Array, past: Array, cancelled: Array, total: number }>}
 */
export const getMyBookings = async () => {
    const response = await apiClient.get('/api/bookings/my');
    return response.data;
};

/**
 * Cancel a booking by its ID.
 * @param {string} bookingId
 * @returns {Promise<{ success: boolean, message: string, booking: object }>}
 */
export const cancelBooking = async (bookingId) => {
    const response = await apiClient.patch(`/api/bookings/${bookingId}/cancel`);
    return response.data;
};


