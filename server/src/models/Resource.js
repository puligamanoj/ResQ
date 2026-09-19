import mongoose from "mongoose";

const resourceSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    type: { type: String, required: true }, // Rescue Team, Medical, Food Supply, Water Supply, Engineering
    location: { type: String, required: true },
    status: {
      type: String,
      enum: ["Available", "Deployed", "Maintenance"],
      default: "Available",
    },
    capacity: { type: String },
    contact: { type: String },
    eta: { type: String, default: "10 mins" },
    assignedTo: { type: String, default: null },
  },
  { timestamps: true }
);

export const Resource = mongoose.models.Resource || mongoose.model("Resource", resourceSchema);
export default Resource;
