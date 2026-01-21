import apiClient from './apiConfig';

/**
 * User signup/registration
 * @param {Object} userData - User registration data (username, email, password)
 * @returns {Promise} User data and token
 */
export const signup = async (userData) => {
    const response = await apiClient.post('/api/users/signup', userData);

    // Store token and user data in localStorage
    if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
    }

    return response.data;
};

/**
 * User login
 * @param {Object} credentials - Login credentials (email, password)
 * @returns {Promise} User data and token
 */
export const login = async (credentials) => {
    const response = await apiClient.post('/api/users/login', credentials);

    // Store token and user data in localStorage
    if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
    }

    return response.data;
};

/**
 * User logout
 * Clears local storage and optionally notifies backend
 * @returns {Promise} Logout confirmation
 */
export const logout = async () => {
    try {
        await apiClient.post('/api/users/logout');
    } catch (error) {
        console.error('Logout error:', error);
    } finally {
        // Always clear local storage even if API call fails
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    }
};

/**
 * Get current user profile
 * @returns {Promise} User profile data
 */
export const getProfile = async () => {
    const response = await apiClient.get('/api/users/profile');
    return response.data;
};

/**
 * Check if user is currently logged in
 * @returns {boolean} Login status
 */
export const isLoggedIn = () => {
    return !!localStorage.getItem('token');
};

/**
 * Get current user data from localStorage
 * @returns {Object|null} User data or null if not logged in
 */
export const getCurrentUser = () => {
    const userString = localStorage.getItem('user');
    return userString ? JSON.parse(userString) : null;
};

/**
 * Get current auth token
 * @returns {string|null} Auth token or null
 */
export const getToken = () => {
    return localStorage.getItem('token');
};
