// const mongoose = require("mongoose");
// const Schema = mongoose.Schema;

// const reviewSchema = new Schema({
//     comment: String,
//     rating: {
//         type: Number,
//         min: 1,
//         max: 5,
//     },
//     createdAt: {
//         type: Date,
//         default: Date.now(),
//     },
// });

// module.exports = mongoose.model("Review", reviewSchema);
// models/review.js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    content: {
        type: String,
        required: [true, "Review content is required"]
    },
    rating: {
        type: Number,
        required: [true, "Rating is required"],
        min: [1, "Rating must be at least 1"],
        max: [5, "Rating cannot exceed 5"]
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }
});

// Add this to ensure the model is properly exported
const Review = mongoose.model("Review", reviewSchema);
module.exports = Review;