import express from "express";
import { getUsers } from "../controllers/user.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { allowRoles } from "../middlewares/role.middleware.js";

const router = express.Router();

/**
 * View all users
 * Allowed: ADMIN, MANAGER
 */
router.get(
  "/",
  protect,
  allowRoles("ADMIN", "MANAGER"),
  getUsers
);

export default router;
