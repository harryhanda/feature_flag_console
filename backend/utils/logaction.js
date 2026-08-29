const Audit = require("../models/audit");

/**
 * Record an audit entry. Never throws - a logging failure should not break
 * the request that triggered it, but we do log to the console so it's
 * visible in server logs.
 */
async function logAction({ action, user, feature, oldValue, newValue, details = {} }) {
  try {
    await Audit.create({
      action,
      doneBy: user?.email || "unknown",
      user: user?._id,
      feature,
      oldValue,
      newValue,
      details,
    });
  } catch (err) {
    console.error("⚠️  Audit log failed:", err.message);
  }
}

module.exports = logAction;
