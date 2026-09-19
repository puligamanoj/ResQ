import mongoose from "mongoose";

const alertSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    type: {
      type: String,
      enum: ["CRITICAL", "WARNING", "INFO"],
      default: "INFO",
    },
    message: { type: String, required: true },
    timestamp: { type: String, default: "Just now" },
  },
  { timestamps: true }
);

export const Alert = mongoose.models.Alert || mongoose.model("Alert", alertSchema);
export default Alert;
