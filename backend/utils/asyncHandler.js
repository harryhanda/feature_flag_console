// Wraps an async route handler so any thrown/rejected error is forwarded
// to the centralized error handler instead of crashing the process or
// leaking an unhandled rejection.
module.exports = function asyncHandler(fn) {
  return function (req, res, next) {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
