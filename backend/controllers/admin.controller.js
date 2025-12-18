import Shift from "../models/Shift.js";
import SwapRequest from "../models/SwapRequest.js";
import Task from "../models/Task.js";
import User from "../models/User.js";
import ActivityLog from "../models/activityLog.js"

/**
 * GET /api/admin/analytics
 */
export const getAnalytics = async (req, res) => {
  const [totalShifts, pendingSwaps, openTasks, users] = await Promise.all([
    Shift.countDocuments(),
    SwapRequest.countDocuments({ status: "PENDING" }),
    Task.countDocuments({ status: { $ne: "DONE" } }),
    User.countDocuments()
  ]);

  res.json({
    totalShifts,
    pendingSwaps,
    openTasks,
    users
  });
};
export const getActivityLogs = async (req, res) => {
  const logs = await ActivityLog.find()
    .populate("actorId", "name email role")
    .sort({ createdAt: -1 });

  res.json(logs);
};

/**
 * POST /api/admin/bulk-assign
 */
export const bulkAssignTasks = async (req, res) => {
  const { taskIds, userId } = req.body;

  await Task.updateMany(
    { _id: { $in: taskIds } },
    { assignedTo: userId }
  );

  res.json({ message: "Tasks assigned successfully" });
};
