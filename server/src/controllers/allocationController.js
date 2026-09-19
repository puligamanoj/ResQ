import Allocation from "../models/Allocation.js";
import triggerReplanning from "../services/replanningEngine.js";

const initialAllocations = [
  {
    id: "ALC-101",
    emergencyId: "EMG-101",
    emergencyTitle: "Severe Flood — Area A",
    resourceId: "RES-01",
    resourceName: "Rescue Team Alpha",
    assignedAt: "15 mins ago",
    status: "In Transit",
    eta: "8 mins",
    route: "Via Bypass Route B4"
  },
  {
    id: "ALC-102",
    emergencyId: "EMG-102",
    emergencyTitle: "Building Collapse — Area C",
    resourceId: "RES-05",
    resourceName: "Heavy Machinery #01",
    assignedAt: "30 mins ago",
    status: "On Site",
    eta: "Arrived",
    route: "Via Downtown Main Arterial"
  }
];

export const getAllocations = async (req, res) => {
  try {
    const list = await Allocation.find();
    if (list.length > 0) return res.json(list);
  } catch (error) {}
  res.json(initialAllocations);
};

export const createAllocation = async (req, res) => {
  try {
    const allocation = new Allocation(req.body);
    await allocation.save();
    res.status(201).json({ success: true, allocation });
  } catch (error) {
    const fallback = {
      id: `ALC-${Math.floor(100 + Math.random() * 900)}`,
      ...req.body,
      assignedAt: new Date().toISOString()
    };
    initialAllocations.unshift(fallback);
    res.status(201).json({ success: true, allocation: fallback });
  }
};

export const triggerDynamicReplanning = async (req, res) => {
  const { event, emergencies, resources, roads } = req.body;
  const result = triggerReplanning(
    event || "Dynamic Event Trigger",
    emergencies || [],
    resources || [],
    roads || []
  );
  res.json(result);
};
