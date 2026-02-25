const Booking = require("../models/booking");
const Listing = require("../models/listing");
const IntervalTree = require("../utils/IntervalTree");

// ─── In-memory LRU cache for interval trees (per listing) ─────────
const treeCache = new Map();
const CACHE_TTL_MS = 60 * 1000; // 1 minute

/**
 * Build (or retrieve from cache) an IntervalTree for a listing.
 */
async function getTreeForListing(listingId) {
    const now = Date.now();
    const cached = treeCache.get(listingId);

    if (cached && cached.expiry > now) {
        return cached.tree;
    }

    // Fetch only confirmed bookings that haven't ended yet
    const bookings = await Booking.find({
        listingId,
        status: "confirmed",
        endDate: { $gte: new Date() },
    }).lean();

    const tree = IntervalTree.fromBookings(bookings);
    treeCache.set(listingId, { tree, expiry: now + CACHE_TTL_MS });
    return tree;
}

/**
 * Invalidate the cached tree when bookings change.
 */
function invalidateCache(listingId) {
    treeCache.delete(listingId);
}

// ═══════════════════════════════════════════════════════════════
//  CONTROLLER: Check Availability
// ═══════════════════════════════════════════════════════════════
module.exports.checkAvailability = async (req, res) => {
    const { id } = req.params; // listing id
    const { startDate, endDate } = req.body;

    if (!startDate || !endDate) {
        return res.status(400).json({ error: "startDate and endDate are required" });
    }

    const start = new Date(startDate).getTime();
    const end = new Date(endDate).getTime();

    if (end <= start) {
        return res.status(400).json({ error: "endDate must be after startDate" });
    }

    // Build interval tree from existing bookings
    const tree = await getTreeForListing(id);

    // O(log N) overlap detection — the core DSA operation
    const conflict = tree.findOverlap({ low: start, high: end });

    if (conflict) {
        return res.json({
            available: false,
            conflict: {
                bookingId: conflict.bookingId,
                startDate: new Date(conflict.interval.low),
                endDate: new Date(conflict.interval.high),
            },
            algorithm: {
                name: "Interval Tree (Augmented BST)",
                complexity: "O(log N)",
                treeSize: tree.size,
            },
        });
    }

    return res.json({
        available: true,
        algorithm: {
            name: "Interval Tree (Augmented BST)",
            complexity: "O(log N)",
            treeSize: tree.size,
        },
    });
};

// ═══════════════════════════════════════════════════════════════
//  CONTROLLER: Create Booking  (conflict-free)
// ═══════════════════════════════════════════════════════════════
module.exports.createBooking = async (req, res) => {
    const { id } = req.params; // listing id

    if (!req.user || !req.user.id) {
        return res.status(401).json({ error: "Authentication required" });
    }

    const { startDate, endDate, guests } = req.body.booking || req.body;

    if (!startDate || !endDate) {
        return res.status(400).json({ error: "startDate and endDate are required" });
    }

    const start = new Date(startDate).getTime();
    const end = new Date(endDate).getTime();

    if (end <= start) {
        return res.status(400).json({ error: "endDate must be after startDate" });
    }

    // Verify the listing exists
    const listing = await Listing.findById(id);
    if (!listing) {
        return res.status(404).json({ error: "Listing not found" });
    }

    // ── Step 1: Build interval tree & check for overlaps ──
    const tree = await getTreeForListing(id);
    const conflict = tree.findOverlap({ low: start, high: end });

    if (conflict) {
        return res.status(409).json({
            error: "Dates are already booked",
            conflict: {
                bookingId: conflict.bookingId,
                startDate: new Date(conflict.interval.low),
                endDate: new Date(conflict.interval.high),
            },
        });
    }

    // ── Step 2: Calculate total price ──
    const nights = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    const totalPrice = nights * listing.price;

    // ── Step 3: Double-check & save (race-condition guard) ──
    // Re-query DB to ensure no booking was inserted between tree check and save
    const lastMinuteConflict = await Booking.findOne({
        listingId: id,
        status: "confirmed",
        startDate: { $lt: new Date(endDate) },
        endDate: { $gt: new Date(startDate) },
    });

    if (lastMinuteConflict) {
        invalidateCache(id);
        return res.status(409).json({
            error: "Dates were just booked by another user",
            conflict: {
                bookingId: lastMinuteConflict._id,
                startDate: lastMinuteConflict.startDate,
                endDate: lastMinuteConflict.endDate,
            },
        });
    }

    // ── Step 4: Create the booking ──
    const booking = new Booking({
        listingId: id,
        guestId: req.user.id,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        guests: guests || 1,
        totalPrice,
        status: "confirmed",
    });

    await booking.save();

    // Invalidate cache so the next check includes this new booking
    invalidateCache(id);

    return res.status(201).json({
        success: true,
        booking,
        priceBreakdown: {
            nights,
            pricePerNight: listing.price,
            totalPrice,
        },
        algorithm: {
            name: "Interval Tree (Augmented BST)",
            complexity: "O(log N)",
            treeSize: tree.size + 1,
        },
        message: "Booking confirmed!",
    });
};

// ═══════════════════════════════════════════════════════════════
//  CONTROLLER: Get all Bookings for a Listing
// ═══════════════════════════════════════════════════════════════
module.exports.getBookings = async (req, res) => {
    const { id } = req.params;

    const bookings = await Booking.find({
        listingId: id,
        status: "confirmed",
        endDate: { $gte: new Date() },
    })
        .sort({ startDate: 1 })
        .lean();

    return res.json({
        bookings,
        count: bookings.length,
    });
};

// ═══════════════════════════════════════════════════════════════
//  CONTROLLER: Get all Bookings for the logged-in User
// ═══════════════════════════════════════════════════════════════
module.exports.getMyBookings = async (req, res) => {
    if (!req.user || !req.user.id) {
        return res.status(401).json({ error: "Authentication required" });
    }

    const now = new Date();

    // Upcoming bookings (endDate >= today)
    const upcoming = await Booking.find({
        guestId: req.user.id,
        status: "confirmed",
        endDate: { $gte: now },
    })
        .populate("listingId", "title location country price image")
        .sort({ startDate: 1 })
        .lean();

    // Past bookings (endDate < today)
    const past = await Booking.find({
        guestId: req.user.id,
        endDate: { $lt: now },
    })
        .populate("listingId", "title location country price image")
        .sort({ startDate: -1 })
        .lean();

    // Cancelled bookings
    const cancelled = await Booking.find({
        guestId: req.user.id,
        status: "cancelled",
    })
        .populate("listingId", "title location country price image")
        .sort({ createdAt: -1 })
        .lean();

    return res.json({
        upcoming,
        past,
        cancelled,
        total: upcoming.length + past.length + cancelled.length,
    });
};

// ═══════════════════════════════════════════════════════════════
//  CONTROLLER: Cancel a Booking
// ═══════════════════════════════════════════════════════════════
module.exports.cancelBooking = async (req, res) => {
    if (!req.user || !req.user.id) {
        return res.status(401).json({ error: "Authentication required" });
    }

    const { bookingId } = req.params;

    const booking = await Booking.findById(bookingId);
    if (!booking) {
        return res.status(404).json({ error: "Booking not found" });
    }

    // Only the guest who made the booking can cancel
    if (booking.guestId.toString() !== req.user.id) {
        return res.status(403).json({ error: "You can only cancel your own bookings" });
    }

    if (booking.status === "cancelled") {
        return res.status(400).json({ error: "Booking is already cancelled" });
    }

    booking.status = "cancelled";
    await booking.save();

    // Invalidate interval tree cache so future availability checks are correct
    invalidateCache(booking.listingId.toString());

    return res.json({
        success: true,
        message: "Booking cancelled successfully",
        booking,
    });
};

