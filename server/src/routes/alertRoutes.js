import express from "express";
import Alert from "../models/Alert.js";

const router = express.Router();

const initialAlerts = [
  {
    id: "ALT-01",
    title: "Road R17 Blocked",
    type: "WARNING",
    message: "Emergency dispatch #EMG-101 re-routed due to landslide on Highway R17.",
    timestamp: "5 mins ago"
  },
  {
    id: "ALT-02",
    title: "Ambulance #03 Deployed",
    type: "INFO",
    message: "Ambulance #03 assigned to Area C building collapse. ETA 8 minutes.",
    timestamp: "12 mins ago"
  },
  {
    id: "ALT-03",
    title: "Shelter Capacity Warning",
    type: "CRITICAL",
    message: "City Indoor Sports Complex is at 92% capacity. Redirecting to St. Jude.",
    timestamp: "20 mins ago"
  }
];

router.get("/", async (req, res) => {
  try {
    const list = await Alert.find().sort({ createdAt: -1 });
    if (list.length > 0) return res.json(list);
  } catch (error) {}
  res.json(initialAlerts);
});

router.post("/", async (req, res) => {
  try {
    const alert = new Alert(req.body);
    await alert.save();
    res.status(201).json({ success: true, alert });
  } catch (error) {
    const fallback = {
      id: `ALT-${Math.floor(10 + Math.random() * 90)}`,
      ...req.body,
      timestamp: "Just now"
    };
    initialAlerts.unshift(fallback);
    res.status(201).json({ success: true, alert: fallback });
  }
});

export default router;
