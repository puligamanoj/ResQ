import mongoose from "mongoose";

const missingPersonSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    age: { type: Number, required: true },
    lastSeenLocation: { type: String, required: true },
    status: {
      type: String,
      enum: ["Searching", "Located & Safe", "Matched"],
      default: "Searching",
    },
    reportedBy: { type: String },
    contactPhone: { type: String, required: true },
    details: { type: String },
  },
  { timestamps: true }
);

export const MissingPerson = mongoose.models.MissingPerson || mongoose.model("MissingPerson", missingPersonSchema);
export default MissingPerson;
