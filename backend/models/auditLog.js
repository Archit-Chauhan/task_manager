import mongoose from "mongoose";

const auditLogSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true
      // Examples:
      // SHIFT_CREATED, SHIFT_PUBLISHED, SHIFT_DELETED
      // TASK_CREATED, TASK_UPDATED
      // SWAP_REQUESTED, SWAP_APPROVED
    },

    actorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    targetType: {
      type: String,
      required: true
      // Examples: "SHIFT", "TASK", "SWAP"
    },

    targetId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },

    payload: {
      type: Object,
      default: {}
    }
  },
  { timestamps: true }
);

export default mongoose.model("AuditLog", auditLogSchema);
