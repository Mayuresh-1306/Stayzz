import express from "express";
import wrapAsync from "../utils/wrapAsync.js";
import * as listingController from "../controllers/listing.js";
import { isLoggedIn, isOwner, validateListing, verifyToken } from "../middleware.js";
import multer from 'multer';
import { storage } from "../config/index.js";

const router = express.Router();
const upload = multer({ storage });

router
    .route("/")
    .get(wrapAsync(listingController.index))
    .post(verifyToken, isLoggedIn, upload.single("listing[image]"), validateListing, wrapAsync(listingController.createListing));

router.get("/new", verifyToken, isLoggedIn, listingController.renderNewForm);

router.route("/:id")
    .get(wrapAsync(listingController.showListing))
    .put(verifyToken, isLoggedIn, isOwner, upload.single("listing[image]"), validateListing, wrapAsync(listingController.updateListing))
    .delete(verifyToken, isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));

router.get("/:id/edit", verifyToken, isOwner, isLoggedIn, wrapAsync(listingController.renderEditForm));

export default router;
