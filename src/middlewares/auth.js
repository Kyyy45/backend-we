import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

/**
 * Middleware untuk verifikasi JWT (Bearer Token)
 */
export const verifyToken = () => async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Token tidak ditemukan" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("-password");
    if (!user) return res.status(404).json({ message: "User tidak ditemukan" });

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Token tidak valid atau sudah kadaluarsa" });
  }
};

/**
 * Middleware untuk otorisasi berdasarkan role
 */
export const roleAuth = (roles = []) => {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });

    if (roles.length && !roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Akses ditolak: Role tidak diizinkan" });
    }

    next();
  };
};