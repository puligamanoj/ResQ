import mongoose from "mongoose";

const roadSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    status: {
      type: String,
      enum: ["Clear", "Blocked", "Flooded"],
      default: "Clear",
    },
    cause: { type: String, default: "None" },
    alternativeRoute: { type: String, default: "N/A" },
    delayImpact: { type: String, default: "Normal" },
  },
  { timestamps: true }
);

export const Road = mongoose.models.Road || mongoose.model("Road", roadSchema);
export default Road;
