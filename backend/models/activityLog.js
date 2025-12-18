import mongoose from "mongoose";

const activityLogSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true
    },
    actorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    actorRole: String,

    targetType: {
      type: String // SHIFT, SWAP, TASK, USER
    },
    targetId: {
      type: mongoose.Schema.Types.ObjectId
    },

    message: {
      type: String
    },

    payload: {
      type: Object
    }
  },
  { timestamps: true }
);

export default mongoose.models.ActivityLog ||
  mongoose.model("ActivityLog", activityLogSchema);