import jwt from "jsonwebtoken";

/**
 * verifyToken(roles = [])
 * - roles: array of allowed roles, empty array means any authenticated user
 */
export const verifyToken = (roles = []) => {
  return (req, res, next) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ errors: ["Token tidak ditemukan"] });
      }

      const token = authHeader.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Role check
      if (roles.length && !roles.includes(decoded.role)) {
        return res.status(403).json({ errors: ["Akses ditolak"] });
      }

      req.user = decoded;
      next();
    } catch (error) {
      return res
        .status(401)
        .json({ errors: ["Token tidak valid atau kadaluarsa"] });
    }
  };
};