// Minimal in-memory rate limiter. Good enough for a single-instance
// deployment (Render free/hobby tier). If you scale to multiple instances,
// swap this for `express-rate-limit` backed by Redis so limits are shared.
//
// This intentionally avoids adding a hard dependency on express-rate-limit
// so the project runs even before `npm install` picks up new packages.

function createRateLimiter({ windowMs = 60 * 1000, max = 20, message = "Too many requests, please try again later." } = {}) {
  const hits = new Map(); // ip -> [timestamps]

  // periodically clear stale entries so this doesn't leak memory forever
  setInterval(() => {
    const cutoff = Date.now() - windowMs;
    for (const [key, timestamps] of hits.entries()) {
      const fresh = timestamps.filter((t) => t > cutoff);
      if (fresh.length === 0) hits.delete(key);
      else hits.set(key, fresh);
    }
  }, windowMs).unref();

  return function rateLimit(req, res, next) {
    const key = req.ip || req.connection?.remoteAddress || "unknown";
    const now = Date.now();
    const cutoff = now - windowMs;

    const timestamps = (hits.get(key) || []).filter((t) => t > cutoff);
    timestamps.push(now);
    hits.set(key, timestamps);

    if (timestamps.length > max) {
      return res.status(429).json({ success: false, message });
    }
    next();
  };
}

module.exports = createRateLimiter;
