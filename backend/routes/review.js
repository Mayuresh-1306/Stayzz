import express from "express";
import wrapAsync from "../utils/wrapAsync.js";
import { validateReview, isLoggedIn, isReviewAuthor, verifyToken } from "../middleware.js";
import * as reviewController from "../controllers/review.js";

const router = express.Router({ mergeParams: true });

router.get("/", wrapAsync(reviewController.getReviews));

router.post("/", verifyToken, isLoggedIn, validateReview, wrapAsync(reviewController.createReview));

router.delete("/:reviewId", verifyToken, isLoggedIn, isReviewAuthor, wrapAsync(reviewController.destroyReview));

export default router;