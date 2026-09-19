import express from "express";
import Road from "../models/Road.js";

const router = express.Router();

const initialRoads = [
  {
    id: "ROAD-17",
    name: "Highway R17 (North Connector)",
    status: "Blocked",
    cause: "Landslide & Mudflow",
    alternativeRoute: "Bypass Route B4",
    delayImpact: "+15 minutes"
  },
  {
    id: "ROAD-04",
    name: "River Bridge Drive",
    status: "Flooded",
    cause: "River Overflow (1.2m depth)",
    alternativeRoute: "Elevated Overpass West",
    delayImpact: "+22 minutes"
  },
  {
    id: "ROAD-09",
    name: "Downtown Main Arterial",
    status: "Clear",
    cause: "None",
    alternativeRoute: "N/A",
    delayImpact: "Normal"
  }
];

router.get("/", async (req, res) => {
  try {
    const roads = await Road.find();
    if (roads.length > 0) return res.json(roads);
  } catch (error) {}
  res.json(initialRoads);
});

router.patch("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const road = await Road.findByIdAndUpdate(id, req.body, { new: true });
    if (road) return res.json({ success: true, road });
  } catch (error) {}

  const mem = initialRoads.find((r) => r.id === id);
  if (mem) Object.assign(mem, req.body);
  res.json({ success: true, road: mem || initialRoads[0] });
});

export default router;
