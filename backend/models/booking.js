const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bookingSchema = new Schema({
    listingId: {
        type: Schema.Types.ObjectId,
        ref: "Listing",
        required: true,
        index: true,
    },
    guestId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    startDate: {
        type: Date,
        required: true,
    },
    endDate: {
        type: Date,
        required: true,
    },
    guests: {
        type: Number,
        default: 1,
        min: 1,
    },
    totalPrice: {
        type: Number,
        min: 0,
    },
    status: {
        type: String,
        enum: ["confirmed", "cancelled", "pending"],
        default: "confirmed",
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Compound index for fast per-listing queries
bookingSchema.index({ listingId: 1, startDate: 1, endDate: 1 });

// Validation: endDate must be after startDate
bookingSchema.pre("validate", function (next) {
    if (this.endDate <= this.startDate) {
        return next(new Error("endDate must be after startDate"));
    }
    next();
});

const Booking = mongoose.model("Booking", bookingSchema);
module.exports = Booking;
