import api from "./api";

const mockEmergencies = [
  {
    id: "EMG-101",
    title: "Severe Flood — Area A",
    location: "North River District",
    affectedPeople: 32,
    vulnerablePeople: 12,
    urgency: "CRITICAL",
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
    type: "Fire",
    status: "Active",
    reportedAt: "40 mins ago",
    description: "Transformer fire threatening adjacent warehouse units."
  }
];

export const emergencyService = {
  getEmergencies: async () => {
    try {
      const response = await api.get("/emergencies");
      return response.data;
    } catch (error) {
      return mockEmergencies;
    }
  },

  reportEmergency: async (emergencyData) => {
    try {
      const response = await api.post("/emergencies", emergencyData);
      return response.data;
    } catch (error) {
      const newEmergency = {
        id: `EMG-${Math.floor(100 + Math.random() * 900)}`,
        ...emergencyData,
        status: "Active",
        reportedAt: "Just now"
      };
      mockEmergencies.unshift(newEmergency);
      return { success: true, emergency: newEmergency };
    }
  },

  updateStatus: async (id, status) => {
    try {
      const response = await api.patch(`/emergencies/${id}`, { status });
      return response.data;
    } catch (error) {
      const item = mockEmergencies.find((e) => e.id === id);
      if (item) item.status = status;
      return { success: true, emergency: item };
    }
  }
};

export default emergencyService;
