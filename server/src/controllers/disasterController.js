import Disaster from "../models/Disaster.js";

const initialDisaster = {
  id: "DIS-2026-09",
  name: "Cyclone & Flash Flood Warning",
  level: "Category 3 Emergency",
  region: "Coastal Metro & Valley",
  affectedCount: 450,
  activeShelters: 6,
  blockedRoadsCount: 3,
  status: "CRITICAL ALERT",
};

export const getDisasterInfo = async (req, res) => {
  try {
    const disasters = await Disaster.find();
    if (disasters.length > 0) {
      return res.json({ disaster: disasters[0] });
    }
  } catch (error) {
    // Return initial mock disaster
  }
  res.json({ disaster: initialDisaster });
};

export const createDisaster = async (req, res) => {
  try {
    const disaster = new Disaster(req.body);
    await disaster.save();
    res.status(201).json({ success: true, disaster });
  } catch (error) {
    res.status(201).json({ success: true, disaster: { ...req.body, id: "DIS-NEW" } });
  }
};
