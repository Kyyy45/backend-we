import rateLimit from "express-rate-limit";

/**
 * Batasi percobaan login atau forgot-password
 */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { message: "Terlalu banyak percobaan, coba lagi nanti." },
  standardHeaders: true,
  legacyHeaders: false,
});