import express from "express";
import {
  getAnalytics,
  bulkAssignTasks
} from "../controllers/admin.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { allowRoles } from "../middlewares/role.middleware.js";
import { getActivityLogs } from "../controllers/admin.controller.js";

const router = express.Router();

// Dashboard analytics
router.get(
  "/analytics",
  protect,
  allowRoles("ADMIN"),
  getAnalytics
);

router.get(
  "/activity-logs",
  protect,
  allowRoles("ADMIN"),
  getActivityLogs
);


// Bulk assign tasks
router.post(
  "/bulk-assign",
  protect,
  allowRoles("ADMIN", "MANAGER"),
  bulkAssignTasks
);

export default router;
