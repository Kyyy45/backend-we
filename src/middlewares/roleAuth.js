/**
 * roleAuth(allowedRoles)
 * - allowedRoles: array of roles yang diizinkan untuk mengakses endpoint
 * - Contoh: roleAuth(["admin", "teacher"])
 */
export const roleAuth = (allowedRoles = []) => {
  return (req, res, next) => {
    try {
      // Pastikan verifyToken sudah dijalankan sebelumnya
      if (!req.user) {
        return res.status(401).json({
          errors: ["User belum terautentikasi, jalankan verifyToken terlebih dahulu"]
        });
      }

      const { role } = req.user;

      // Jika endpoint butuh role tertentu
      if (allowedRoles.length && !allowedRoles.includes(role)) {
        return res.status(403).json({
          errors: ["Akses ditolak, Anda tidak memiliki izin untuk mengakses resource ini"]
        });
      }

      next();
    } catch (error) {
      return res.status(500).json({
        errors: ["Terjadi kesalahan pada middleware roleAuth", error.message]
      });
    }
  };
};
