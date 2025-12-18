import SwapRequest from "../models/SwapRequest.js";
import { approveSwap } from "../services/swap.service.js";
import { logActivity } from "../services/audit.service.js";

/**
 * GET /api/swaps
 */
export const getSwaps = async (req, res) => {
  const swaps = await SwapRequest.find()
    .populate("requesterId", "name email role")
    .populate("targetOwnerId", "name email role")
    .populate("requesterShiftId")
    .populate("targetShiftId");

  res.json(swaps);
};

/**
 * POST /api/swaps
 * Employee creates swap request
 */
export const createSwap = async (req, res) => {
  try {
    const swap = await SwapRequest.create({
      requesterId: req.user.id,
      requesterShiftId: req.body.requesterShiftId,
      targetOwnerId: req.body.targetOwnerId,
      targetShiftId: req.body.targetShiftId,
      status: "PENDING"
    });

    // 📝 AUDIT LOG
    await logActivity({
      type: "SWAP_REQUESTED",
      actor: req.user,
      targetType: "SWAP",
      targetId: swap._id,
      message: "Shift swap requested"
    });

    res.status(201).json(swap);

  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

/**
 * POST /api/swaps/:id/respond
 * Manager/Admin approves or rejects swap
 */
export const respondSwap = async (req, res) => {
  const { action } = req.body;

  const swap = await SwapRequest.findById(req.params.id);
  if (!swap) {
    return res.status(404).json({ message: "Swap request not found" });
  }

  if (swap.status !== "PENDING") {
    return res.status(400).json({
      message: "Swap already processed"
    });
  }

  if (action === "APPROVE") {
    await approveSwap(req.params.id);

    // 📝 AUDIT LOG
    await logActivity({
      type: "SWAP_APPROVED",
      actor: req.user,
      targetType: "SWAP",
      targetId: swap._id,
      message: "Shift swap approved"
    });

    return res.json({ message: "Swap approved" });
  }

  if (action === "REJECT") {
    swap.status = "REJECTED";
    await swap.save();

    // AUDIT LOG
    await logActivity({
      type: "SWAP_REJECTED",
      actor: req.user,
      targetType: "SWAP",
      targetId: swap._id,
      message: "Shift swap rejected"
    });

    return res.json({ message: "Swap rejected" });
  }

  res.status(400).json({ message: "Invalid action" });
};
