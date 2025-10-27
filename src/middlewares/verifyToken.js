import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

/**
 * verifyToken(roles = [])
 * - roles: role yang diizinkan, contoh ["admin"], ["teacher", "admin"], atau kosong = semua user login
 */
export const verifyToken = (roles = []) => {
  return async (req, res, next) => {
    try {
      // Ambil token dari header atau cookie
      const authHeader = req.headers.authorization;
      const token =
        authHeader?.startsWith("Bearer ")
          ? authHeader.split(" ")[1]
          : req.cookies?.accessToken;

      if (!token) {
        return res.status(401).json({ errors: ["Token tidak ditemukan"] });
      }

      // Verifikasi token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Cek apakah user masih ada di database
      const user = await User.findById(decoded.id).select("-password");
      if (!user) {
        return res.status(404).json({ errors: ["User tidak ditemukan"] });
      }

      // Cek role jika diperlukan
      if (roles.length && !roles.includes(user.role)) {
        return res.status(403).json({ errors: ["Akses ditolak"] });
      }

      // Simpan user ke req
      req.user = user;
      next();
    } catch (error) {
      return res
        .status(401)
        .json({ errors: ["Token tidak valid atau kadaluarsa"] });
    }
  };
};
