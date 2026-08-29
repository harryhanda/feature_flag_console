const ApiError = require("../utils/ApiError");

// 404 handler - runs when no route matched
function notFound(req, res, next) {
  next(new ApiError(404, `Route not found: ${req.method} ${req.originalUrl}`));
}

// Centralized error handler. Every route in this app funnels its errors
// here (via asyncHandler or next(err)) so responses are always consistent
// and we never leak stack traces / raw Mongo errors to the client.
function errorHandler(err, req, res, next) {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Server error";

  // Mongoose validation error
  if (err.name === "ValidationError") {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((e) => e.message)
      .join(", ");
  }

  // Mongoose duplicate key error (e.g. duplicate email or feature name)
  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue || {})[0] || "field";
    message = `${field} already exists`;
  }

  // Invalid ObjectId passed to a Mongoose query
  if (err.name === "CastError") {
    statusCode = 400;
    message = `Invalid ${err.path}`;
  }

  // JWT errors
  if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Invalid token";
  }
  if (err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Token expired";
  }

  if (statusCode >= 500) {
    // Log full detail server-side only
    console.error("❌ Server error:", err);
    if (process.env.NODE_ENV === "production") {
      message = "Something went wrong. Please try again later.";
    }
  }

  res.status(statusCode).json({ success: false, message });
}

module.exports = { notFound, errorHandler };
