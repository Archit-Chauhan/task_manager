import Shift from "../models/Shift.js";
import { hasShiftConflict } from "../services/shiftConflict.service.js";
import { logActivity } from "../services/audit.service.js";

/**
 * GET /api/shifts
 */
export const getShifts = async (req, res) => {
  const query =
    req.user.role === "EMPLOYEE"
      ? { assignedTo: req.user.id }
      : {};

  const shifts = await Shift.find(query).populate("assignedTo", "name email");
  res.json(shifts);
};

/**
 * POST /api/shifts
 */
export const createShift = async (req, res) => {
  try {
    const { assignedTo, startTime, endTime } = req.body;

    if (assignedTo && startTime && endTime) {
      const conflict = await hasShiftConflict({
        userId: assignedTo,
        startTime,
        endTime
      });

      if (conflict) {
        return res.status(400).json({
          message: "Employee already has a conflicting shift"
        });
      }
    }

    const shift = await Shift.create(req.body);

    await logActivity({
      type: "SHIFT_CREATED",
      actor: req.user,
      targetType: "Shift",
      targetId: shift._id,
      message: `Shift "${shift.title}" created`,
      payload: shift
    });

    res.status(201).json(shift);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

/**
 * PUT /api/shifts/:id
 */
export const updateShift = async (req, res) => {
  const shift = await Shift.findById(req.params.id);
  if (!shift) {
    return res.status(404).json({ message: "Shift not found" });
  }

  const { assignedTo, startTime, endTime } = req.body;

  if (assignedTo && startTime && endTime) {
    const conflict = await hasShiftConflict({
      userId: assignedTo,
      startTime,
      endTime,
      excludeShiftId: shift._id
    });

    if (conflict) {
      return res.status(400).json({
        message: "Employee already has a conflicting shift"
      });
    }
  }

  const updated = await Shift.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  await logActivity({
    type: "SHIFT_UPDATED",
    actor: req.user,
    targetType: "Shift",
    targetId: updated._id,
    message: `Shift "${updated.title}" updated`,
    payload: req.body
  });

  res.json(updated);
};

/**
 * DELETE /api/shifts/:id
 */
export const deleteShift = async (req, res) => {
  const shift = await Shift.findByIdAndDelete(req.params.id);

  if (shift) {
    await logActivity({
      type: "SHIFT_DELETED",
      actor: req.user,
      targetType: "Shift",
      targetId: shift._id,
      message: `Shift "${shift.title}" deleted`
    });
  }

  res.json({ message: "Shift deleted" });
};

/**
 * POST /api/shifts/:id/publish
 */
export const publishShift = async (req, res) => {
  const shift = await Shift.findByIdAndUpdate(
    req.params.id,
    { status: "PUBLISHED" },
    { new: true }
  );

  if (!shift) {
    return res.status(404).json({ message: "Shift not found" });
  }

  await logActivity({
    type: "SHIFT_PUBLISHED",
    actor: req.user,
    targetType: "Shift",
    targetId: shift._id,
    message: `Shift "${shift.title}" published`
  });

  res.json(shift);
};
