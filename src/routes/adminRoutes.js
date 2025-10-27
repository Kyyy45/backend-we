import express from "express";
import { verifyToken } from "../middlewares/verifyToken.js";
import { roleAuth } from "../middlewares/roleAuth.js";
import { getAllUsers, deleteUser, updateUserRole } from "../controllers/adminController.js";

const router = express.Router();

router.get("/users", verifyToken(), roleAuth(["admin"]), getAllUsers);
router.delete("/users/:id", verifyToken(), roleAuth(["admin"]), deleteUser);
router.patch("/users/:id/role", verifyToken(), roleAuth(["admin"]), updateUserRole);

export default router;
