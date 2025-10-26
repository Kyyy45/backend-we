import express from "express";
import { verifyToken } from "../middlewares/verifyToken.js";

const router = express.Router();

router.get("/admin-data", verifyToken(["admin"]), (req, res) => {
  res.json({ message: "Data khusus admin", user: req.user.id });
});

router.get("/profile", verifyToken(["member","admin"]), (req, res) => {
  res.json({ message: "Profile user", user: req.user.id });
});

export default router;