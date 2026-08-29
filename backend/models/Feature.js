const mongoose = require("mongoose");

const ENVIRONMENTS = ["development", "staging", "production"];

// Define the structure (schema) of a feature flag
const featureSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      required: false,
      default: "",
    },
    enabled: {
      type: Boolean,
      default: false,
    },
    rollout: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
    // Optional per-environment overrides. If a given environment key is not
    // set here, evaluation falls back to the top-level `enabled` flag.
    // e.g. { development: true, staging: true, production: false }
    environments: {
      type: Map,
      of: Boolean,
      default: undefined,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (doc, ret) => {
        // Mongoose Maps serialize awkwardly by default; expose plain object
        if (ret.environments instanceof Map) {
          ret.environments = Object.fromEntries(ret.environments);
        }
        return ret;
      },
    },
  }
);

const Feature = mongoose.model("Feature", featureSchema);

module.exports = Feature;
module.exports.ENVIRONMENTS = ENVIRONMENTS;
