const express = require("express");
const Feature = require("../models/Feature");
const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const { evaluateFeature } = require("../utils/rollout");

const router = express.Router();

// Only the fields a client needs to render UI. Never leak _id-linked user
// data, createdBy/updatedBy, or timestamps that aren't needed here.
function toPublicShape(feature, resolvedEnabled) {
  return {
    name: feature.name,
    enabled: resolvedEnabled,
  };
}

function getEvalContext(req) {
  const environment = (req.query.environment || "production").toLowerCase();
  // The client supplies a stable, anonymous bucket key (e.g. a random id
  // it generates once and persists in localStorage) so the same visitor
  // consistently gets the same rollout result. We never trust this to
  // authenticate anyone — it's evaluation-only.
  const bucketKey = req.query.userId || req.query.bucketKey || req.ip;
  return { environment, bucketKey };
}

// GET /api/public/features — evaluated state of every flag
router.get(
  "/features",
  asyncHandler(async (req, res) => {
    const { environment, bucketKey } = getEvalContext(req);
    const features = await Feature.find().select("name enabled rollout environments");

    const data = features.map((f) =>
      toPublicShape(f, evaluateFeature(f, { environment, bucketKey }))
    );

    res.json({ success: true, data });
  })
);

// GET /api/public/features/:name — evaluated state of a single flag
router.get(
  "/features/:name",
  asyncHandler(async (req, res) => {
    const { environment, bucketKey } = getEvalContext(req);
    const feature = await Feature.findOne({ name: req.params.name }).select(
      "name enabled rollout environments"
    );

    if (!feature) throw new ApiError(404, "Feature not found");

    const resolved = evaluateFeature(feature, { environment, bucketKey });
    res.json({ success: true, data: toPublicShape(feature, resolved) });
  })
);

module.exports = router;
