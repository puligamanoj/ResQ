import mongoose from "mongoose";

const emergencySchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    location: { type: String, required: true },
    type: { type: String, required: true }, // Flood, Building Collapse, Fire, Medical, Food Shortage
    affectedPeople: { type: Number, required: true, default: 1 },
    vulnerablePeople: { type: Number, default: 0 },
    urgency: {
      type: String,
      enum: ["CRITICAL", "HIGH", "MEDIUM", "LOW"],
      default: "HIGH",
    },
    priorityScore: { type: Number, default: 50 },
    priorityRank: { type: String, default: "HIGH" },
    accessibilityScore: { type: Number, default: 8 }, // 1 to 10
    waitingTimeMinutes: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["Active", "In Progress", "Resolved"],
      default: "Active",
    },
    description: { type: String },
    reportedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const Emergency = mongoose.models.Emergency || mongoose.model("Emergency", emergencySchema);
export default Emergency;
