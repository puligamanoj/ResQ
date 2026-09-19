import mongoose from "mongoose";

const shelterSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    location: { type: String, required: true },
    capacity: { type: Number, required: true },
    occupied: { type: Number, default: 0 },
    supplies: { type: String, default: "Adequate" },
    contact: { type: String },
  },
  { timestamps: true }
);

export const Shelter = mongoose.models.Shelter || mongoose.model("Shelter", shelterSchema);
export default Shelter;
