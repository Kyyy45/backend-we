import express from "express";
import { verifyToken, roleAuth } from "../middlewares/auth.js";
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
  roleAuth(["member", "admin"]),
  getMemberDashboard
);

export default router;