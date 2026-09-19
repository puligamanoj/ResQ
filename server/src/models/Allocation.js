import mongoose from "mongoose";

const allocationSchema = new mongoose.Schema(
  {
    emergencyId: { type: String, required: true },
    emergencyTitle: { type: String, required: true },
    resourceId: { type: String, required: true },
    resourceName: { type: String, required: true },
    status: { type: String, default: "In Transit" }, // In Transit, On Site, Completed
    eta: { type: String, default: "10 mins" },
    route: { type: String, default: "Standard Dispatch Route" },
    matchScore: { type: Number, default: 85 },
    assignedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const Allocation = mongoose.models.Allocation || mongoose.model("Allocation", allocationSchema);
export default Allocation;
