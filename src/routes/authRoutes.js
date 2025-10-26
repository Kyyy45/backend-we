import express from "express";
import {
  register,
  login,
  activateAccount,
  refreshToken,
  logout,
} from "../controllers/authController.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/activation", activateAccount);
router.post("/refresh-token", refreshToken);
router.post("/logout", logout);

export default router;