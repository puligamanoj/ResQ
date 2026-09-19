import mongoose from "mongoose";

const disasterSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    level: { type: String, default: "Category 3 Emergency" },
    region: { type: String, required: true },
    affectedCount: { type: Number, default: 0 },
    activeShelters: { type: Number, default: 0 },
    blockedRoadsCount: { type: Number, default: 0 },
    status: { type: String, default: "CRITICAL ALERT" },
  },
  { timestamps: true }
);

export const Disaster = mongoose.models.Disaster || mongoose.model("Disaster", disasterSchema);
export default Disaster;
