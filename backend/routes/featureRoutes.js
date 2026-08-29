const express = require("express");
const Feature = require("../models/Feature");
const { requireAuth, requireRole } = require("../middleware/authMiddleware");
const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const logAction = require("../utils/logaction");

const router = express.Router();

// All feature management routes require a logged-in user.
router.use(requireAuth);

// GET /api/features  — any authenticated role can read
router.get(
  "/",
  asyncHandler(async (req, res) => {
    const features = await Feature.find().sort({ createdAt: -1 });
    res.json({ success: true, data: features });
  })
);

router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const feature = await Feature.findById(req.params.id);
    if (!feature) throw new ApiError(404, "Feature not found");
    res.json({ success: true, data: feature });
  })
);

// POST /api/features — admin or developer only
router.post(
  "/",
  requireRole("admin", "developer"),
  asyncHandler(async (req, res) => {
    const { name, description, enabled, rollout, environments } = req.body;

    if (!name || !name.trim()) {
      throw new ApiError(400, "Feature name is required");
    }

    const feature = await Feature.create({
      name: name.trim(),
      description,
      enabled: !!enabled,
      rollout: rollout ?? 0,
      environments,
      createdBy: req.user._id,
      updatedBy: req.user._id,
    });

    await logAction({
      action: "CREATE_FEATURE",
      user: req.user,
      feature: feature.name,
      newValue: feature.toJSON(),
    });

    res.status(201).json({ success: true, data: feature });
  })
);

// PUT /api/features/:id — admin or developer only
router.put(
  "/:id",
  requireRole("admin", "developer"),
  asyncHandler(async (req, res) => {
    const feature = await Feature.findById(req.params.id);
    if (!feature) throw new ApiError(404, "Feature not found");

    const oldValue = feature.toJSON();

    const { name, description, enabled, rollout, environments } = req.body;
    if (name !== undefined) feature.name = name;
    if (description !== undefined) feature.description = description;
    if (enabled !== undefined) feature.enabled = enabled;
    if (rollout !== undefined) feature.rollout = rollout;
    if (environments !== undefined) feature.environments = environments;
    feature.updatedBy = req.user._id;

    await feature.save();

    const changedRollout = oldValue.rollout !== feature.rollout;
    const changedEnabled = oldValue.enabled !== feature.enabled;

    await logAction({
      action: changedEnabled
        ? "TOGGLE_FEATURE"
        : changedRollout
        ? "ROLLOUT_CHANGED"
        : "UPDATE_FEATURE",
      user: req.user,
      feature: feature.name,
      oldValue,
      newValue: feature.toJSON(),
    });

    res.json({ success: true, data: feature });
  })
);

// DELETE /api/features/:id — admin only
router.delete(
  "/:id",
  requireRole("admin"),
  asyncHandler(async (req, res) => {
    const feature = await Feature.findById(req.params.id);
    if (!feature) throw new ApiError(404, "Feature not found");

    await feature.deleteOne();

    await logAction({
      action: "DELETE_FEATURE",
      user: req.user,
      feature: feature.name,
      oldValue: feature.toJSON(),
    });

    res.json({ success: true, message: "Feature deleted successfully" });
  })
);

module.exports = router;
