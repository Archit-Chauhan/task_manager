import mongoose from "mongoose";

export default mongoose.model("Shift", new mongoose.Schema({
  title: String,
  startTime: Date,
  endTime: Date,
  roleRequired: String,
  location: String,
  status: { type: String, default: "DRAFT" },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  metadata: Object
}));
