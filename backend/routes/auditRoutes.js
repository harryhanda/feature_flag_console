const express = require("express");
const Audit = require("../models/audit");
const { requireAuth, requireRole } = require("../middleware/authMiddleware");
const asyncHandler = require("../utils/asyncHandler");

const router = express.Router();

// Audit logs are visible to admin and developer roles, not viewers.
router.get(
  "/",
  requireAuth,
  requireRole("admin", "developer"),
  asyncHandler(async (req, res) => {
    const { user, action, feature, from, to, limit } = req.query;
    const filter = {};

    if (user) filter.doneBy = user;
    if (action) filter.action = action;
    if (feature) filter.feature = feature;
    if (from || to) {
      filter.timestamp = {};
      if (from) filter.timestamp.$gte = new Date(from);
      if (to) filter.timestamp.$lte = new Date(to);
    }

    const logs = await Audit.find(filter)
      .sort({ timestamp: -1 })
      .limit(Math.min(Number(limit) || 200, 500));

    res.json({ success: true, data: logs });
  })
);

module.exports = router;
