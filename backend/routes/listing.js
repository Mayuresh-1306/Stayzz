 const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const {isloggedIn, isOwner, validateListing, verifyToken} = require("../middleware.js");
const listingController = require("../controllers/listing.js");
const multer  = require('multer')
const {storage } = require("../cloudConfig.js");
const upload = multer({ storage });

router
.route("/")
.get( wrapAsync(listingController.index))
.post(verifyToken, isloggedIn, upload.single("listing[image]"),validateListing, wrapAsync(listingController.createListing));

// New Route with better error handling
router.get("/new", verifyToken, isloggedIn, listingController.renderNewForm );

router.route("/:id")
.get( wrapAsync(listingController.showListing))
.put( verifyToken, isloggedIn, isOwner, upload.single("listing[image]"), validateListing, wrapAsync(listingController.updateListing) )
.delete( verifyToken, isloggedIn, isOwner, wrapAsync(listingController.destroyListing) );



 //Edit Route
 router.get("/:id/edit", verifyToken, isOwner, isloggedIn, wrapAsync(listingController.renderEditForm));

  module.exports = router;
