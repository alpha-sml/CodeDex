import express from "express";
import { signup, login, logout, getProfile, refreshAccessToken } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", protect, logout);
router.post("/refresh", refreshAccessToken);

router.get("/me", protect, getProfile);

export default router;
