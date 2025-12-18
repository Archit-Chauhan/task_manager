import express from "express";
import {
  getSwaps,
  createSwap,
  respondSwap
} from "../controllers/swap.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

// View swaps
router.get("/", protect, getSwaps);

// Create swap request (Employee)
router.post("/", protect, createSwap);

// Approve / Reject swap
router.post("/:id/respond", protect, respondSwap);

export default router;
