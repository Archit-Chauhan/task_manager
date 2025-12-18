import express from "express";
import {
  getShifts,
  createShift,
  updateShift,
  deleteShift,
  publishShift
} from "../controllers/shift.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { allowRoles } from "../middlewares/role.middleware.js";

const router = express.Router();

// View shifts
router.get("/", protect, getShifts);

// Create shift (Admin / Manager)
router.post(
  "/",
  protect,
  allowRoles("ADMIN", "MANAGER"),
  createShift
);

// Update shift
router.put(
  "/:id",
  protect,
  allowRoles("ADMIN", "MANAGER"),
  updateShift
);

// Delete shift
router.delete(
  "/:id",
  protect,
  allowRoles("ADMIN", "MANAGER"),
  deleteShift
);

// Publish shift
router.post(
  "/:id/publish",
  protect,
  allowRoles("ADMIN", "MANAGER"),
  publishShift
);

export default router;
