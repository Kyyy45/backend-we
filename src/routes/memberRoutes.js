import express from "express";
import { verifyToken } from "../middlewares/verifyToken.js";
import { roleAuth } from "../middlewares/roleAuth.js";
import { getMemberDashboard } from "../controllers/memberController.js";

const router = express.Router();

/**
 * @route   GET /api/member/dashboard
 * @desc    Dashboard khusus member
 * @access  Private (Member & Admin)
 */
router.get(
  "/dashboard",
  verifyToken(),
  roleAuth(["member", "admin"]), // Admin juga boleh akses
  getMemberDashboard
);

export default router;