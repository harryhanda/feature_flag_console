const express = require("express");
const { requireAuth, requireRole } = require("../middleware/authMiddleware");
const User = require("../models/User");
const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const logAction = require("../utils/logaction");

const router = express.Router();

router.use(requireAuth, requireRole("admin"));

router.get(
  "/",
  asyncHandler(async (req, res) => {
    const users = await User.find().select("-password");
    res.json({ success: true, data: users });
  })
);

router.put(
  "/role/:id",
  asyncHandler(async (req, res) => {
    const { role } = req.body;
    const validRoles = ["admin", "developer", "viewer"];

    if (!validRoles.includes(role)) {
      throw new ApiError(400, `Role must be one of: ${validRoles.join(", ")}`);
    }

    // An admin cannot change their own role — prevents accidental or
    // malicious self-demotion/lockout and forces a second admin to do it.
    if (String(req.user._id) === String(req.params.id)) {
      throw new ApiError(403, "You cannot change your own role");
    }

    const target = await User.findById(req.params.id);
    if (!target) throw new ApiError(404, "User not found");

    const oldRole = target.role;
    target.role = role;
    await target.save();

    await logAction({
      action: "ROLE_CHANGED",
      user: req.user,
      details: { targetUser: target.email, oldRole, newRole: role },
    });

    res.json({ success: true, message: "Role updated", data: { _id: target._id, role: target.role } });
  })
);

router.delete(
  "/:id",
  asyncHandler(async (req, res) => {
    if (String(req.user._id) === String(req.params.id)) {
      throw new ApiError(403, "You cannot delete your own account");
    }

    const target = await User.findById(req.params.id);
    if (!target) throw new ApiError(404, "User not found");

    await target.deleteOne();

    await logAction({
      action: "USER_DELETED",
      user: req.user,
      details: { deletedUser: target.email },
    });

    res.json({ success: true, message: "User deleted" });
  })
);

module.exports = router;
