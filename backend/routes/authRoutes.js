const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { requireAuth } = require("../middleware/authMiddleware");
const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const createRateLimiter = require("../middleware/rateLimiter");

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

// Auth endpoints are brute-force targets — limit attempts per IP.
const authLimiter = createRateLimiter({ windowMs: 60 * 1000, max: 15 });

function signToken(user) {
  return jwt.sign(
    { _id: user._id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: "7d" }
  );
}

function toSafeUser(user) {
  return { _id: user._id, email: user.email, role: user.role, name: user.name };
}

router.post(
  "/register",
  authLimiter,
  asyncHandler(async (req, res) => {
    const { email, password, name } = req.body;

    if (!email || !password) {
      throw new ApiError(400, "Email and password are required");
    }
    if (password.length < 6) {
      throw new ApiError(400, "Password must be at least 6 characters");
    }

    const existing = await User.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      throw new ApiError(409, "An account with this email already exists");
    }

    // Every self-registered account starts as "viewer". Only an existing
    // admin can promote someone via /api/users/role/:id — the register
    // endpoint can never be used to create an admin.
    const newUser = await User.create({
      email,
      password,
      name,
      role: "viewer",
    });

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: toSafeUser(newUser),
    });
  })
);

router.post(
  "/login",
  authLimiter,
  asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new ApiError(400, "Email and password are required");
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      throw new ApiError(401, "Invalid email or password");
    }

    const match = await user.matchPassword(password);
    if (!match) {
      throw new ApiError(401, "Invalid email or password");
    }

    const token = signToken(user);

    res.json({
      success: true,
      data: { token, user: toSafeUser(user) },
    });
  })
);

// Stateless JWTs can't be "revoked" server-side without a blocklist, but we
// expose this endpoint so the frontend has a consistent contract and so a
// token-blocklist can be added later without changing the client.
router.post("/logout", requireAuth, (req, res) => {
  res.json({ success: true, message: "Logged out" });
});

router.get("/me", requireAuth, (req, res) => {
  res.json({ success: true, data: toSafeUser(req.user) });
});

router.put(
  "/change-password",
  requireAuth,
  asyncHandler(async (req, res) => {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      throw new ApiError(400, "Old and new password are required");
    }
    if (newPassword.length < 6) {
      throw new ApiError(400, "New password must be at least 6 characters");
    }

    const user = await User.findById(req.user._id);
    const match = await user.matchPassword(oldPassword);
    if (!match) {
      throw new ApiError(400, "Old password is incorrect");
    }

    user.password = newPassword;
    await user.save();

    res.json({ success: true, message: "Password updated successfully" });
  })
);

module.exports = router;
