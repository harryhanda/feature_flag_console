const express = require("express");
const Feature = require("../models/Feature");

const router = express.Router();

// ✅ GET all features
router.get("/", async (req, res) => {
  try {
    const features = await Feature.find();
    res.json(features);
  } catch (error) {
    res.status(500).json({ message: "Error fetching features", error });
  }
});

// ✅ POST - Add new feature
router.post("/", async (req, res) => {
  console.log("📥 Received POST:", req.body); // 👀 Add this
  try {
    const { name, description, enabled, rollout } = req.body;
    const newFeature = new Feature({ name, description, enabled, rollout });
    const savedFeature = await newFeature.save();
    console.log("✅ Saved to DB:", savedFeature); // 👀 Add this
    res.status(201).json(savedFeature);
  } catch (error) {
    console.error("❌ Error creating feature:", error);
    res.status(400).json({ message: "Error creating feature", error });
  }
});


// ✅ PUT - Update feature (by ID)
router.put("/:id", async (req, res) => {
  try {
    const updatedFeature = await Feature.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedFeature);
  } catch (error) {
    res.status(400).json({ message: "Error updating feature", error });
  }
});

// ✅ DELETE - Remove feature (by ID)
router.delete("/:id", async (req, res) => {
  try {
    await Feature.findByIdAndDelete(req.params.id);
    res.json({ message: "Feature deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting feature", error });
  }
});

module.exports = router;
