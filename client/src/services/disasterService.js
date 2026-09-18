import api from "./api";

const mockDisasterData = {
  disaster: {
    id: "DIS-2026-09",
    name: "Cyclone & Flash Flood Warning",
    level: "Category 3 Emergency",
    region: "Coastal Metro & Valley",
    affectedCount: 450,
    activeShelters: 6,
    blockedRoadsCount: 3,
    status: "CRITICAL ALERT"
  },
  shelters: [
    {
      id: "SHL-01",
      name: "St. Jude High School Shelter",
      location: "Area B - North Sector",
      capacity: 300,
      occupied: 215,
      supplies: "Good (Water: 85%, Food: 70%, Meds: 90%)",
      contact: "+1 555-8821"
    },
    {
      id: "SHL-02",
      name: "City Indoor Sports Complex",
      location: "Area A - West End",
      capacity: 500,
      occupied: 460,
      supplies: "Low (Water: 20%, Food: 30%, Meds: 40%)",
      contact: "+1 555-8822"
    },
    {
      id: "SHL-03",
      name: "East Side Community Hall",
      location: "Area D - East Bay",
      capacity: 200,
      occupied: 85,
      supplies: "Adequate (Water: 60%, Food: 65%, Meds: 80%)",
      contact: "+1 555-8823"
    }
  ],
  roadStatus: [
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
  ],
  allocations: [
    {
      id: "ALC-101",
      emergencyId: "EMG-101",
      emergencyTitle: "Severe Flood — Area A",
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
      resourceName: "Heavy Machinery #01",
      assignedAt: "30 mins ago",
      status: "On Site",
      eta: "Arrived",
      route: "Via Downtown Main Arterial"
    }
  ],
  alerts: [
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
  ],
  replanningDecisions: [
    {
      id: "DEC-01",
      triggerEvent: "Road R17 Landslide Blockage",
      affectedDispatch: "Rescue Team Alpha to EMG-101",
      aiRecommendation: "Divert via Bypass Route B4 instead of Highway R17",
      reasoning: "Highway R17 is completely impassable. Bypass Route B4 adds 4km but avoids 45-minute clearing delay.",
      confidenceScore: "96%"
    },
    {
      id: "DEC-02",
      triggerEvent: "Medical Emergency Surge in Area A",
      affectedDispatch: "Ambulance Unit #03",
      aiRecommendation: "Reassign Ambulance #03 from Area B low-priority transfer to Area A high-priority trauma",
      reasoning: "Severity matrix places Area A trauma at CRITICAL rank 1. Nearest available unit is Ambulance #03.",
      confidenceScore: "98%"
    }
  ]
};

export const disasterService = {
  getDisasterInfo: async () => {
    try {
      const response = await api.get("/disaster/info");
      return response.data;
    } catch (error) {
      return mockDisasterData;
    }
  },

  getShelters: async () => {
    try {
      const response = await api.get("/shelters");
      return response.data;
    } catch (error) {
      return mockDisasterData.shelters;
    }
  },

  getRoadStatus: async () => {
    try {
      const response = await api.get("/roads");
      return response.data;
    } catch (error) {
      return mockDisasterData.roadStatus;
    }
  },

  getAllocations: async () => {
    try {
      const response = await api.get("/allocations");
      return response.data;
    } catch (error) {
      return mockDisasterData.allocations;
    }
  },

  getAlerts: async () => {
    try {
      const response = await api.get("/alerts");
      return response.data;
    } catch (error) {
      return mockDisasterData.alerts;
    }
  },

  getReplanningDecisions: async () => {
    try {
      const response = await api.get("/replanning");
      return response.data;
    } catch (error) {
      return mockDisasterData.replanningDecisions;
    }
  }
};

export default disasterService;
