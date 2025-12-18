import express from "express";
import {
  getTasks,
  getMyTasks,
  createTask,
  updateTask,
  assignTask,
  transferShiftTasks
} from "../controllers/task.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { allowRoles } from "../middlewares/role.middleware.js";

const router = express.Router();

// View tasks
router.get("/my", protect, allowRoles("EMPLOYEE"),getMyTasks);
router.get(
  "/",
  protect,
  allowRoles("MANAGER", "ADMIN"),
  getTasks
);


// Create task
router.post(
  "/",
  protect,
  allowRoles("ADMIN", "MANAGER"),
  createTask
);

// Update task
router.put(
  "/:id",
  protect,
  allowRoles("EMPLOYEE","ADMIN", "MANAGER"),
  updateTask
);

// Assign task to user
router.post(
  "/:id/assign",
  protect,
  allowRoles("ADMIN", "MANAGER"),
  assignTask
);

// Transfer shift-linked tasks
router.post(
  "/:id/transfer-shift",
  protect,
  allowRoles("ADMIN", "MANAGER"),
  transferShiftTasks
);

export default router;
