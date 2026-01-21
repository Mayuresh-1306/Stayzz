import express from "express";
import wrapAsync from "../utils/wrapAsync.js";
import jwt from "jsonwebtoken";
import { verifyToken } from "../middleware.js";
import * as userController from "../controllers/user.js";

const router = express.Router();

router.post("/signup", wrapAsync(userController.signup));

router.post("/login", wrapAsync(userController.login));

router.post("/logout", verifyToken, (req, res) => {
    res.json({ message: "Logged out successfully" });
});

router.get("/profile", verifyToken, wrapAsync(userController.getProfile));

export default router;
