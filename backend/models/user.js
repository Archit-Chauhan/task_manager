import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  hashedPassword: String,
  role: { type: String, enum: ["ADMIN", "MANAGER", "EMPLOYEE"] },
  skills: [String],
  weeklyHourLimit: { type: Number, default: 40 },
  timezone: String
}, { timestamps: true });

export default mongoose.model("User", userSchema);
