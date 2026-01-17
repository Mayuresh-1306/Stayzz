const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const jwt = require("jsonwebtoken");
const { verifyToken } = require("../middleware.js");

const userController = require("../controllers/user.js");

// Signup route
router.post("/signup", wrapAsync(userController.signup));

// Login route
router.post("/login", wrapAsync(userController.login));

// Logout route
router.post("/logout", verifyToken, (req, res) => {
    res.json({ message: "Logged out successfully" });
});

// Get current user profile
router.get("/profile", verifyToken, wrapAsync(userController.getProfile));

module.exports = router;
