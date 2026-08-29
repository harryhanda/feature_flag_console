const express = require("express");
const cors = require("cors");

const featureRoutes = require("./routes/featureRoutes");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const auditRoutes = require("./routes/auditRoutes");
const publicRoutes = require("./routes/publicRoutes");
const { notFound, errorHandler } = require("./middleware/errorHandler");
const mongoose = require("mongoose");

const app = express();

// ---------------------------------------------------------------------
// Security headers. Uses `helmet` if it's installed (run `npm install`
// first); falls back to a hand-rolled subset of the same headers so the
// server still starts cleanly if you haven't installed it yet.
// ---------------------------------------------------------------------
try {
  const helmet = require("helmet");
  app.use(helmet());
} catch {
  app.use((req, res, next) => {
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("X-Frame-Options", "DENY");
    res.setHeader("Referrer-Policy", "no-referrer-when-downgrade");
    next();
  });
}

// ---------------------------------------------------------------------
// General rate limiting across the whole API. Uses `express-rate-limit`
// if installed, otherwise falls back to the built-in limiter.
// ---------------------------------------------------------------------
if (process.env.NODE_ENV !== "test") {
  try {
    const rateLimit = require("express-rate-limit");
    app.use(
      "/api",
      rateLimit({ windowMs: 60 * 1000, max: 120, standardHeaders: true, legacyHeaders: false })
    );
  } catch {
    const createRateLimiter = require("./middleware/rateLimiter");
    app.use("/api", createRateLimiter({ windowMs: 60 * 1000, max: 120 }));
  }
}

// ---------------------------------------------------------------------
// CORS — only allow the known frontend/demo-client origins, and only
// reflect credentials for those. Never use origin:"*" with credentials.
// ---------------------------------------------------------------------
const allowedOrigins = [
  process.env.FRONTEND_URL,
  process.env.DEMO_CLIENT_URL,
  "http://localhost:3000", // CRA dev server
  "http://127.0.0.1:5500", // common Live Server default for demo_client
  "http://localhost:5500",
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow non-browser tools (curl, server-to-server, health checks)
      // that don't send an Origin header at all.
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true,
  })
);

app.use(express.json());

// ---------------------------------------------------------------------
// Routes
// ---------------------------------------------------------------------
app.get("/", (req, res) => {
  res.send("Feature Flag Backend is running 🚀");
});

app.get("/health", (req, res) => {
  const dbState = mongoose.connection.readyState; // 1 = connected
  const healthy = dbState === 1;
  res.status(healthy ? 200 : 503).json({
    status: healthy ? "ok" : "unhealthy",
    database: healthy ? "connected" : "disconnected",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/features", featureRoutes);
app.use("/api/audit", auditRoutes);
app.use("/api/public", publicRoutes);

// 404 + centralized error handler (must be last)
app.use(notFound);
app.use(errorHandler);

module.exports = app;
