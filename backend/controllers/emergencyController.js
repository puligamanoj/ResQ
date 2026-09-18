const mockData = require('../data/mockData');
const { runAllocationEngine } = require('../services/allocationEngine');

const getEmergencies = (req, res) => {
  const emergencies = mockData.getEmergencies();
  res.status(200).json(emergencies);
};

const getEmergencyById = (req, res) => {
  const { id } = req.params;
  const emergencies = mockData.getEmergencies();
  const emergency = emergencies.find(e => e.id === id);

  if (!emergency) {
    return res.status(404).json({ error: 'Emergency not found' });
  }

  res.status(200).json(emergency);
};

const createEmergency = (req, res) => {
  const { title, latitude, longitude, severity, peopleAffected, requiredResource, accessibility } = req.body;

  if (!title) {
    return res.status(400).json({ error: 'Title is required for emergency' });
  }

  const emergencies = mockData.getEmergencies();
  const newEmergency = {
    id: `E${100 + emergencies.length + 1}`,
    title,
    latitude: Number(latitude) || 12.9600,
    longitude: Number(longitude) || 77.5900,
    severity: (severity || 'HIGH').toUpperCase(),
    peopleAffected: Number(peopleAffected) || 10,
    status: 'PENDING',
    requiredResource: requiredResource || 'Rescue Team',
    accessibility: accessibility || 'ACCESSIBLE',
    createdAt: new Date().toISOString()
  };

  emergencies.unshift(newEmergency);
  mockData.setEmergencies(emergencies);

  // Run allocation engine to recompute assignments
  const engineResult = runAllocationEngine(null, null, null, `New Emergency Reported: ${newEmergency.title}`);
  const allocations = engineResult.allocations || [];
  mockData.setAllocations(allocations);

  const thisAllocation = allocations.find(a => a.emergencyId === newEmergency.id);

  res.status(201).json({
    message: 'Emergency created and allocated successfully',
    emergency: newEmergency,
    allocation: thisAllocation || null,
    allAllocations: allocations
  });
};

const updateEmergency = (req, res) => {
  const { id } = req.params;
  const emergencies = mockData.getEmergencies();
  const resources = mockData.getResources();
  const index = emergencies.findIndex(e => e.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Emergency not found' });
  }

  const allowedUpdates = ['title', 'latitude', 'longitude', 'severity', 'peopleAffected', 'status', 'requiredResource', 'accessibility'];
  allowedUpdates.forEach(field => {
    if (req.body[field] !== undefined) {
      emergencies[index][field] = req.body[field];
    }
  });

  let freedResourceName = null;
  // If status is updated to Completed or RESOLVED, free up assigned resources
  if (req.body.status && (req.body.status.toUpperCase() === 'COMPLETED' || req.body.status.toUpperCase() === 'RESOLVED')) {
    emergencies[index].status = 'Completed';
    resources.forEach(r => {
      if (r.currentEmergencyId === id) {
        r.status = 'Available';
        r.availability = true;
        r.currentEmergencyId = null;
        freedResourceName = r.name;
      }
    });
    mockData.setResources(resources);
  }

  mockData.setEmergencies(emergencies);

  // Re-run allocation engine on change
  const engineResult = runAllocationEngine(null, null, null, `Emergency Updated: ${emergencies[index].title}`);
  const allocations = engineResult.allocations || [];
  mockData.setAllocations(allocations);

  res.status(200).json({
    message: 'Rescue work completed successfully',
    emergency: emergencies[index],
    freedResource: freedResourceName,
    allocations: allocations,
    resources: mockData.getResources()
  });
};

module.exports = {
  getEmergencies,
  getEmergencyById,
  createEmergency,
  updateEmergency
};
