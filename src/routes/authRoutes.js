import express from "express";
import {
  register,
  login,
  activateAccount,
  resendActivation,
  refreshToken,
  logout,
  forgotPassword,
  resetPassword,
} from "../controllers/authController.js";

const router = express.Router();

router.post("/register", register);
router.post("/activation", activateAccount);
router.post("/login", login);
router.post("/refresh-token", refreshToken);
router.post("/logout", logout);
router.post("/resend-activation", resendActivation);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

export default router;