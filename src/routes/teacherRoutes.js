import express from "express";
import { verifyToken } from "../middlewares/verifyToken.js";
import { roleAuth } from "../middlewares/roleAuth.js";
import { getTeacherDashboard } from "../controllers/teacherController.js";

const router = express.Router();

/**
 * @route   GET /api/teacher/dashboard
 * @desc    Dashboard khusus teacher
 * @access  Private (Teacher & Admin)
 */
router.get(
  "/dashboard",
  verifyToken(),
  roleAuth(["teacher", "admin"]), // Admin bisa akses
  getTeacherDashboard
);

export default router;
