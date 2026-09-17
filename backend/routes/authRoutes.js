const express = require("express");
const rateLimit = require("express-rate-limit");

const {
  register,
  login,
  refreshToken,
  getProfile,
  updateProfile,
  changePassword,
} = require("../controllers/authController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// ==========================================
// RATE LIMITERS
// ==========================================

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many login attempts. Please try again later.",
  },
});

const registerLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many registration attempts. Please try again later.",
  },
});

// ==========================================
// AUTH ROUTES
// ==========================================

router.post("/register", registerLimiter, register);

router.post("/login", loginLimiter, login);

router.post("/refresh-token", refreshToken);

// ==========================================
// PROTECTED ROUTES
// ==========================================

router.get("/profile", protect, getProfile);

router.put("/profile", protect, updateProfile);

router.put("/change-password", protect, changePassword);

module.exports = router;
