const mongoose = require("mongoose");

const auditSchema = new mongoose.Schema({
  // e.g. CREATE_FEATURE, UPDATE_FEATURE, DELETE_FEATURE, TOGGLE_FEATURE,
  // ROLE_CHANGE, USER_DELETED
  action: { type: String, required: true },

  // Kept for backwards compatibility with the original schema (email string)
  doneBy: { type: String, required: true },

  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

  // Name of the feature this action relates to, if any
  feature: { type: String },

  oldValue: { type: mongoose.Schema.Types.Mixed },
  newValue: { type: mongoose.Schema.Types.Mixed },

  timestamp: { type: Date, default: Date.now },

  // Any extra metadata (IP, request id, etc.)
  details: { type: mongoose.Schema.Types.Mixed },
});

auditSchema.index({ timestamp: -1 });
auditSchema.index({ action: 1 });
auditSchema.index({ feature: 1 });

module.exports = mongoose.model("Audit", auditSchema);
