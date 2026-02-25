const express = require("express");
const router = express.Router({ mergeParams: true }); // mergeParams to access :id from parent
const wrapAsync = require("../utils/wrapAsync.js");
const { verifyToken, isloggedIn } = require("../middleware.js");
const bookingController = require("../controllers/booking.js");

// GET  /api/listings/:id/bookings         → all confirmed bookings for this listing
router.get("/", wrapAsync(bookingController.getBookings));

// POST /api/listings/:id/bookings/check   → check availability (no auth required)
router.post("/check", wrapAsync(bookingController.checkAvailability));

// POST /api/listings/:id/bookings         → create a new booking (auth required)
router.post("/", verifyToken, isloggedIn, wrapAsync(bookingController.createBooking));

module.exports = router;
