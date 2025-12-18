import mongoose from "mongoose";
import SwapRequest from "../models/SwapRequest.js";
import Shift from "../models/Shift.js";
import Task from "../models/Task.js";

export const approveSwap = async (swapId) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const swap = await SwapRequest.findById(swapId).session(session);
    if (!swap) throw new Error("Swap not found");

    if (swap.status !== "PENDING") {
      throw new Error("Swap already processed");
    }

    const requesterShift = await Shift.findById(swap.requesterShiftId).session(session);
    const targetShift = await Shift.findById(swap.targetShiftId).session(session);

    if (!requesterShift || !targetShift) {
      throw new Error("Shift not found");
    }

    // Swap assigned employees
    const temp = requesterShift.assignedTo;
    requesterShift.assignedTo = targetShift.assignedTo;
    targetShift.assignedTo = temp;

    await requesterShift.save({ session });
    await targetShift.save({ session });

    // Transfer tasks linked to shifts
    await Task.updateMany(
      { shiftId: requesterShift._id },
      { assignedTo: requesterShift.assignedTo },
      { session }
    );

    await Task.updateMany(
      { shiftId: targetShift._id },
      { assignedTo: targetShift.assignedTo },
      { session }
    );

    swap.status = "APPROVED";
    await swap.save({ session });

    await session.commitTransaction();
    session.endSession();

  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    throw err;
  }
};
