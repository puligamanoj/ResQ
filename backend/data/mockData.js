// Initial state with mutable in-memory dataset

let emergencies = [
  {
    id: "E101",
    title: "Flood — Area A",
    latitude: 12.9716,
    longitude: 77.5946,
    severity: "CRITICAL",
    urgency: "CRITICAL",
    peopleAffected: 32,
    medicalRequirement: true,
    vulnerablePeople: 8,
    status: "Pending",
    requiredResource: "Rescue Boat",
    accessibility: "ACCESSIBLE",
    priorityScore: 0,
    priorityReason: "",
    createdAt: new Date().toISOString()
  },
  {
    id: "E102",
    title: "Building Collapse — Area C",
    latitude: 12.9352,
    longitude: 77.6245,
    severity: "HIGH",
    urgency: "HIGH",
    peopleAffected: 12,
    medicalRequirement: true,
    vulnerablePeople: 4,
    status: "Pending",
    requiredResource: "Rescue Team",
    accessibility: "ACCESSIBLE",
    priorityScore: 0,
    priorityReason: "",
    createdAt: new Date().toISOString()
  },
  {
    id: "E103",
    title: "Food & Medical Shortage — Area B",
    latitude: 12.9141,
    longitude: 77.6412,
    severity: "MEDIUM",
    urgency: "MEDIUM",
    peopleAffected: 80,
    medicalRequirement: true,
    vulnerablePeople: 15,
    status: "Pending",
    requiredResource: "Medical Team",
    accessibility: "PARTIAL",
    priorityScore: 0,
    priorityReason: "",
    createdAt: new Date().toISOString()
  },
  {
    id: "E104",
    title: "Industrial Fire — Area D",
    latitude: 12.9850,
    longitude: 77.5300,
    severity: "HIGH",
    urgency: "HIGH",
    peopleAffected: 25,
    medicalRequirement: false,
    vulnerablePeople: 2,
    status: "Pending",
    requiredResource: "Fire Truck",
    accessibility: "ACCESSIBLE",
    priorityScore: 0,
    priorityReason: "",
    createdAt: new Date().toISOString()
  }
];

let resources = [
  {
    id: "R01",
    name: "Rescue Boat Alpha",
    type: "Rescue Boat",
    latitude: 12.9650,
    longitude: 77.5850,
    status: "Available",
    capacity: 40,
    capabilities: ["water_rescue", "flood_evacuation"],
    availability: true,
    speed: 35,
    currentEmergencyId: null
  },
  {
    id: "R02",
    name: "Ambulance #03",
    type: "Ambulance",
    latitude: 12.9300,
    longitude: 77.6150,
    status: "Available",
    capacity: 4,
    capabilities: ["medical_evacuation", "triage"],
    availability: true,
    speed: 60,
    currentEmergencyId: null
  },
  {
    id: "R03",
    name: "Fire Truck #05",
    type: "Fire Truck",
    latitude: 12.9800,
    longitude: 77.5400,
    status: "Available",
    capacity: 6,
    capabilities: ["firefighting", "hazard_containment"],
    availability: true,
    speed: 50,
    currentEmergencyId: null
  },
  {
    id: "R04",
    name: "Rescue Team Beta",
    type: "Rescue Team",
    latitude: 12.9400,
    longitude: 77.6300,
    status: "Available",
    capacity: 15,
    capabilities: ["debris_search", "heavy_lifting"],
    availability: true,
    speed: 45,
    currentEmergencyId: null
  },
  {
    id: "R05",
    name: "Medical Team Delta",
    type: "Medical Team",
    latitude: 12.9200,
    longitude: 77.6000,
    status: "Available",
    capacity: 10,
    capabilities: ["first_aid", "field_medicine"],
    availability: true,
    speed: 55,
    currentEmergencyId: null
  },
  {
    id: "R06",
    name: "Rescue Boat Bravo",
    type: "Rescue Boat",
    latitude: 12.9900,
    longitude: 77.5700,
    status: "Available",
    capacity: 30,
    capabilities: ["water_rescue"],
    availability: true,
    speed: 30,
    currentEmergencyId: null
  },
  {
    id: "R07",
    name: "Rescue Boat Charlie",
    type: "Rescue Boat",
    latitude: 12.9550,
    longitude: 77.5900,
    status: "Available",
    capacity: 25,
    capabilities: ["water_rescue"],
    availability: true,
    speed: 32,
    currentEmergencyId: null
  }
];

let hospitals = [
  {
    id: "H01",
    name: "City General Hospital",
    latitude: 12.9750,
    longitude: 77.6050,
    capacity: 200,
    availableBeds: 45,
    contact: "+1-800-555-0199",
    status: "OPERATIONAL"
  },
  {
    id: "H02",
    name: "Apex Trauma Center",
    latitude: 12.9450,
    longitude: 77.6200,
    capacity: 150,
    availableBeds: 22,
    contact: "+1-800-555-0144",
    status: "OPERATIONAL"
  }
];

let shelters = [
  {
    id: "S01",
    name: "Central Relief Shelter A",
    latitude: 12.9600,
    longitude: 77.5900,
    capacity: 500,
    currentOccupancy: 180,
    status: "OPEN"
  },
  {
    id: "S02",
    name: "East District Community Hall",
    latitude: 12.9250,
    longitude: 77.6350,
    capacity: 300,
    currentOccupancy: 95,
    status: "OPEN"
  }
];

let weather = {
  temperature: 28,
  rainfall: 15, // mm/h
  windSpeed: 22, // km/h
  precipitationProbability: 40, // %
  conditions: "Moderate Rain",
  riskLevel: "MODERATE"
};

let routes = [
  { id: "RT01", name: "Road R17", status: "OPEN", latitude: 12.9500, longitude: 77.6100 },
  { id: "RT02", name: "Highway H04", status: "OPEN", latitude: 12.9700, longitude: 77.5600 }
];

let allocations = [];
let planHistory = [];
let governmentActions = [
  {
    id: "ACT-101",
    type: "REQUEST_RESOURCES",
    area: "River Zone",
    emergencyId: "E101",
    description: "Requested 2 additional water rescue units for severe flooding.",
    status: "Initiated",
    createdAt: new Date(Date.now() - 3600000).toISOString()
  },
  {
    id: "ACT-102",
    type: "COORDINATE_MEDICAL",
    area: "Central Zone",
    emergencyId: "E103",
    description: "Medical support squad dispatched for high vulnerability count.",
    status: "Coordinating",
    createdAt: new Date(Date.now() - 1800000).toISOString()
  }
];

module.exports = {
  getEmergencies: () => emergencies,
  setEmergencies: (data) => { emergencies = data; },
  getResources: () => resources,
  setResources: (data) => { resources = data; },
  getHospitals: () => hospitals,
  setHospitals: (data) => { hospitals = data; },
  getShelters: () => shelters,
  setShelters: (data) => { shelters = data; },
  getWeather: () => weather,
  setWeather: (data) => { weather = data; },
  getRoutes: () => routes,
  setRoutes: (data) => { routes = data; },
  getAllocations: () => allocations,
  setAllocations: (data) => { allocations = data; },
  getPlanHistory: () => planHistory,
  setPlanHistory: (data) => { planHistory = data; },
  getGovernmentActions: () => governmentActions,
  setGovernmentActions: (data) => { governmentActions = data; }
};
