import Shift from "../models/Shift.js";

export const hasShiftConflict = async ({
  userId,
  startTime,
  endTime,
  excludeShiftId = null
}) => {
  const query = {
    assignedTo: userId,
    startTime: { $lt: endTime },
    endTime: { $gt: startTime }
  };

  if (excludeShiftId) {
    query._id = { $ne: excludeShiftId };
  }

  const conflict = await Shift.findOne(query);
  return !!conflict;
};
