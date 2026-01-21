import User from "../models/user.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import ExpressError from "../utils/ExpressError.js";

const signToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
    });
};

export const signup = async (req, res) => {
    try {
        const { username, email, password, phone } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ error: "Username, email, and password are required" });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: "Please provide a valid email address" });
        }

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

        const newUser = new User({
            username: username.trim(),
            email: email.toLowerCase().trim(),
            password,
            phone: phone || ""
        });
        await newUser.save();

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
        if (error.code === 11000) {
            const field = Object.keys(error.keyPattern)[0];
            return res.status(400).json({ error: `${field} already exists` });
        }
        res.status(400).json({ error: error.message || "Signup failed" });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: "Please provide email and password" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: "Invalid email or password" });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ error: "Invalid email or password" });
        }

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

export const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).populate("listings");
        res.json({ success: true, user });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};