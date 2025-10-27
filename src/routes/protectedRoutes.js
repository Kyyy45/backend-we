import express from "express";
import { verifyToken } from "../middlewares/verifyToken.js";
import User from "../models/userModel.js";

const router = express.Router();

/** profile: returns current user (without password) */
router.get("/profile", verifyToken(), async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user)
      return res.status(404).json({ errors: ["User tidak ditemukan"] });
    res.json({ user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ errors: ["Terjadi kesalahan server"] });
  }
});

/** admin-only example */
router.get("/admin-data", verifyToken(["admin"]), (req, res) => {
  res.json({ message: "Data khusus admin", userId: req.user.id });
});

export default router;