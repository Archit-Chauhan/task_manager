import Task from "../models/Task.js";
import { logActivity } from "../services/audit.service.js";

/**
 * MANAGER / ADMIN: Get all tasks
 * GET /api/tasks
 */
export const getTasks = async (req, res) => {
  const tasks = await Task.find()
    .populate("assignedTo", "name email");

  res.json(tasks);
};

/**
 * EMPLOYEE: Get own tasks
 * GET /api/tasks/my
 */
export const getMyTasks = async (req, res) => {
  const tasks = await Task.find({
    assignedTo: req.user.id
  });

  res.json(tasks);
};

/**
 * MANAGER / ADMIN: Create task for employee
 * POST /api/tasks
 */
export const createTask = async (req, res) => {
  const { title, description, status, assignedTo, shiftId } = req.body;

  if (!assignedTo) {
    return res.status(400).json({
      message: "Task must be assigned to an employee"
    });
  }

  const task = await Task.create({
    title,
    description,
    status: status || "TODO",
    assignedTo,
    shiftId
  });

  // AUDIT LOG
  await logActivity({
    type: "TASK_CREATED",
    actor: req.user,
    targetType: "TASK",
    targetId: task._id,
    message: `Task "${task.title}" created`
  });

  res.status(201).json(task);
};

/**
 * EMPLOYEE: Update task status (Drag & Drop)
 * MANAGER / ADMIN: Full update
 * PUT /api/tasks/:id
 */
export const updateTask = async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    return res.status(404).json({ message: "Task not found" });
  }

  // Employee can update only their own task
  if (
    req.user.role === "EMPLOYEE" &&
    task.assignedTo?.toString() !== req.user.id
  ) {
    return res.status(403).json({ message: "Access denied" });
  }

  // Employee: only status update
  if (req.user.role === "EMPLOYEE") {
    task.status = req.body.status;
  } else {
    // Manager/Admin: full update
    Object.assign(task, req.body);
  }

  await task.save();

  //AUDIT LOG
  await logActivity({
    type: "TASK_UPDATED",
    actor: req.user,
    targetType: "TASK",
    targetId: task._id,
    message: `Task "${task.title}" updated`
  });

  res.json(task);
};

/**
 * MANAGER / ADMIN: Assign task to employee
 * POST /api/tasks/:id/assign
 */
export const assignTask = async (req, res) => {
  const task = await Task.findByIdAndUpdate(
    req.params.id,
    { assignedTo: req.body.assignedTo },
    { new: true }
  );

  if (!task) {
    return res.status(404).json({ message: "Task not found" });
  }

  // AUDIT LOG
  await logActivity({
    type: "TASK_ASSIGNED",
    actor: req.user,
    targetType: "TASK",
    targetId: task._id,
    message: "Task assigned to employee"
  });

  res.json(task);
};

/**
 * SYSTEM: Transfer tasks during shift swap
 * POST /api/tasks/:id/transfer-shift
 */
export const transferShiftTasks = async (req, res) => {
  const { newOwnerId } = req.body;

  const task = await Task.findByIdAndUpdate(
    req.params.id,
    { assignedTo: newOwnerId },
    { new: true }
  );

  if (!task) {
    return res.status(404).json({ message: "Task not found" });
  }

  // AUDIT LOG
  await logActivity({
    type: "TASK_TRANSFERRED",
    actor: { id: "SYSTEM", role: "SYSTEM" },
    targetType: "TASK",
    targetId: task._id,
    message: "Task transferred due to shift swap"
  });

  res.json(task);
};
