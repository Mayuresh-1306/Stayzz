const User = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const ExpressError = require("../utils/ExpressError");

// Sign JWT Token
const signToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
    });
};

// Signup Controller
module.exports.signup = async (req, res) => {
    try {
        const { username, email, password, phone } = req.body;

        // Validate input
        if (!username || !email || !password) {
            return res.status(400).json({ error: "Username, email, and password are required" });
        }

        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: "Please provide a valid email address" });
        }

        // Check if user exists
        const existingUser = await User.findOne({
            $or: [{ email: email.toLowerCase() }, { username }],
        });
        if (existingUser) {
            if (existingUser.email === email.toLowerCase()) {
                return res.status(400).json({ error: "Email already registered" });
            }
            if (existingUser.username === username) {
                return res.status(400).json({ error: "Username already taken" });
            }
        }

        // Create new user with lowercase email
        const newUser = new User({ 
            username: username.trim(), 
            email: email.toLowerCase().trim(), 
            password, 
            phone: phone || "" 
        });
        await newUser.save();

        // Sign token
        const token = signToken(newUser._id);

        res.status(201).json({
            success: true,
            token,
            user: {
                id: newUser._id,
                username: newUser.username,
                email: newUser.email,
            },
        });
    } catch (error) {
        console.error("Signup error:", error);
        // Handle MongoDB duplicate key error
        if (error.code === 11000) {
            const field = Object.keys(error.keyPattern)[0];
            return res.status(400).json({ error: `${field} already exists` });
        }
        res.status(400).json({ error: error.message || "Signup failed" });
    }
};

// Login Controller
module.exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate email & password
        if (!email || !password) {
            return res.status(400).json({ error: "Please provide email and password" });
        }

        // Check for user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: "Invalid email or password" });
        }

        // Check password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ error: "Invalid email or password" });
        }

        // Sign token
        const token = signToken(user._id);

        res.json({
            success: true,
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
            },
        });
    } catch (error) {
        console.error("Login error:", error);
        res.status(400).json({ error: error.message || "Login failed" });
    }
};

// Get Profile Controller
module.exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).populate("listings");
        res.json({ success: true, user });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};