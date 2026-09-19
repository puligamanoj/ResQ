import Resource from "../models/Resource.js";

const initialResources = [
  {
    id: "RES-01",
    name: "Rescue Team Alpha",
    type: "Rescue Team",
    location: "Area A Sector 2",
    status: "Available",
    capacity: "15 Rescuers",
    contact: "+1 555-0192",
    eta: "5 mins"
  },
  {
    id: "RES-02",
    name: "Ambulance Unit #03",
    type: "Medical",
    location: "Central Trauma Hub",
    status: "Available",
    capacity: "4 Patients",
    contact: "+1 555-0144",
    eta: "8 mins"
  },
  {
    id: "RES-03",
    name: "Relief Food Truck #07",
    type: "Food Supply",
    location: "Area B Relief Camp",
    status: "Deployed",
    capacity: "500 Meals",
    contact: "+1 555-0178",
    eta: "On Site"
  },
  {
    id: "RES-04",
    name: "Water Supply Tanker #02",
    type: "Water Supply",
    location: "Municipal Water Base",
    status: "Available",
    capacity: "5,000 Liters",
    contact: "+1 555-0111",
    eta: "12 mins"
  },
  {
    id: "RES-05",
    name: "Heavy Machinery & Excavator #01",
    type: "Engineering",
    location: "Area C Depot",
    status: "Deployed",
    capacity: "Heavy Debris",
    contact: "+1 555-0199",
    eta: "On Site"
  }
];

export const getResources = async (req, res) => {
  try {
    const list = await Resource.find();
    if (list.length > 0) return res.json(list);
  } catch (error) {}
  res.json(initialResources);
};

export const updateResourceStatus = async (req, res) => {
  const { id } = req.params;
  const { status, assignedTo } = req.body;

  try {
    const item = await Resource.findByIdAndUpdate(id, { status, assignedTo }, { new: true });
    if (item) return res.json({ success: true, resource: item });
  } catch (error) {}

  const mem = initialResources.find((r) => r.id === id);
  if (mem) {
    mem.status = status || mem.status;
    if (assignedTo) mem.assignedTo = assignedTo;
  }
  res.json({ success: true, resource: mem || initialResources[0] });
};
