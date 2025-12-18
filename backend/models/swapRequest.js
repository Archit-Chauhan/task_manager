import mongoose from "mongoose";

const swapRequestSchema = new mongoose.Schema(
  {
    requesterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    requesterShiftId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Shift",
      required: true
    },
    targetOwnerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    targetShiftId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Shift",
      required: true
    },
    status: {
      type: String,
      enum: ["PENDING", "APPROVED", "REJECTED"],
      default: "PENDING"
    }
  },
  { timestamps: true }
);

export default mongoose.model("SwapRequest", swapRequestSchema);
