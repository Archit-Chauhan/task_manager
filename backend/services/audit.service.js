import ActivityLog from "../models/activityLog.js";

export const logActivity = async ({
  type,
  actor,
  targetType,
  targetId,
  message,
  payload = {}
}) => {
  try {
    await ActivityLog.create({
      type,
      actorId: actor.id,
      actorRole: actor.role,
      targetType,
      targetId,
      message,
      payload
    });
  } catch (err) {
    console.error("Audit log failed:", err.message);
  }
};
