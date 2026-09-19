import Emergency from "../models/Emergency.js";
import calculatePriority from "../services/priorityEngine.js";

const initialEmergencies = [
  {
    id: "EMG-101",
    title: "Severe Flood — Area A",
    location: "North River District",
    affectedPeople: 32,
    vulnerablePeople: 12,
    urgency: "CRITICAL",
    priorityScore: 92,
    priorityRank: "CRITICAL",
    type: "Flood",
    status: "Active",
    reportedAt: "10 mins ago",
    description: "Water level rising rapidly. 12 elderly residents stranded in lower floors."
  },
  {
    id: "EMG-102",
    title: "Building Collapse — Area C",
    location: "Commercial Complex",
    affectedPeople: 12,
    vulnerablePeople: 4,
    urgency: "CRITICAL",
    priorityScore: 86,
    priorityRank: "CRITICAL",
    type: "Building Collapse",
    status: "Active",
    reportedAt: "25 mins ago",
    description: "Partial collapse of 2-story building following heavy rain."
  },
  {
    id: "EMG-103",
    title: "Food & Water Shortage — Area B",
    location: "Community Center Shelter",
    affectedPeople: 80,
    vulnerablePeople: 25,
    urgency: "MEDIUM",
    priorityScore: 58,
    priorityRank: "MEDIUM",
    type: "Food Shortage",
    status: "In Progress",
    reportedAt: "1 hour ago",
    description: "Shelter supplies depleted. Clean drinking water urgently needed."
  },
  {
    id: "EMG-104",
    title: "Electrical Substation Fire",
    location: "Industrial Park Gate 4",
    affectedPeople: 8,
    vulnerablePeople: 0,
    urgency: "HIGH",
    priorityScore: 72,
    priorityRank: "HIGH",
    type: "Fire",
    status: "Active",
    reportedAt: "40 mins ago",
    description: "Transformer fire threatening adjacent warehouse units."
  }
];

export const getEmergencies = async (req, res) => {
  try {
    const list = await Emergency.find().sort({ priorityScore: -1 });
    if (list.length > 0) return res.json(list);
  } catch (error) {}
  res.json(initialEmergencies);
};

export const getEmergencyById = async (req, res) => {
  try {
    const item = await Emergency.findById(req.params.id);
    if (item) return res.json(item);
  } catch (error) {}
  const mockItem = initialEmergencies.find((e) => e.id === req.params.id) || initialEmergencies[0];
  res.json(mockItem);
};

export const createEmergency = async (req, res) => {
  try {
    const priorityCalc = calculatePriority(req.body);
    const emergencyData = {
      ...req.body,
      priorityScore: priorityCalc.priorityScore,
      priorityRank: priorityCalc.priorityRank,
    };

    const newEmergency = new Emergency(emergencyData);
    await newEmergency.save();
    res.status(201).json({ success: true, emergency: newEmergency });
  } catch (error) {
    const priorityCalc = calculatePriority(req.body);
    const fallbackItem = {
      id: `EMG-${Math.floor(100 + Math.random() * 900)}`,
      ...req.body,
      priorityScore: priorityCalc.priorityScore,
      priorityRank: priorityCalc.priorityRank,
      status: "Active",
      reportedAt: "Just now"
    };
    initialEmergencies.unshift(fallbackItem);
    res.status(201).json({ success: true, emergency: fallbackItem });
  }
};
