/**
 * Global Error Handler Middleware
 * Handles all errors thrown in the application
 */
const errorHandler = (err, req, res, next) => {
    console.error(err);
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Something went wrong";
    res.status(status).json({ error: message });
};

module.exports = errorHandler;
