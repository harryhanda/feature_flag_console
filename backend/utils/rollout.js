const crypto = require("crypto");

/**
 * Deterministically decide whether a given "bucket key" (usually a stable
 * user id, or an anonymous id the client persists) falls inside a rollout
 * percentage for a given feature.
 *
 * Same featureName + same bucketKey ALWAYS produces the same result, so a
 * user doesn't flicker in and out of a feature between requests. We never
 * use Math.random() here on purpose.
 *
 * @param {string} featureName
 * @param {string} bucketKey - stable identifier (user id, session id, etc.)
 * @param {number} rolloutPercent - 0-100
 * @returns {boolean}
 */
function isInRollout(featureName, bucketKey, rolloutPercent) {
  const pct = Number(rolloutPercent);
  if (!Number.isFinite(pct) || pct <= 0) return false;
  if (pct >= 100) return true;
  if (!bucketKey) return false;

  const hash = crypto
    .createHash("sha256")
    .update(`${featureName}:${bucketKey}`)
    .digest("hex");

  // Take the first 8 hex chars (32 bits) and map to 0-99
  const bucket = parseInt(hash.slice(0, 8), 16) % 100;
  return bucket < pct;
}

/**
 * Resolve whether a feature is "on" for a given environment + bucket key.
 * Falls back to the base `enabled` flag if no environment override exists.
 */
function evaluateFeature(feature, { environment, bucketKey } = {}) {
  let baseEnabled = feature.enabled;

  if (
    environment &&
    feature.environments &&
    typeof feature.environments[environment] === "boolean"
  ) {
    baseEnabled = feature.environments[environment];
  }

  if (!baseEnabled) return false;

  const rollout = feature.rollout;
  if (rollout === undefined || rollout === null || rollout >= 100) {
    return baseEnabled;
  }

  return isInRollout(feature.name, bucketKey, rollout);
}

module.exports = { isInRollout, evaluateFeature };
