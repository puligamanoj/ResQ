const { calculateDistance } = require('../utils/distance');
const {
  calculateDynamicPriority,
  getCompatibilityScore,
  getWeatherRiskPenalty,
  calculateETA,
  calculateScore
} = require('../utils/scoring');
const mockData = require('../data/mockData');

/**
 * Serving Resource Allocation & Dynamic Replanning Engine
 * Supports Versioning (PLAN V1, PLAN V2...) and Human Approval tracking.
 */
function runAllocationEngine(overrideEmergencies = null, overrideResources = null, overrideWeather = null, triggerEvent = "Automatic Allocation") {
  const emergencies = overrideEmergencies || mockData.getEmergencies();
  const resources = overrideResources || mockData.getResources();
  const weather = overrideWeather || mockData.getWeather();

  // 1. Calculate Dynamic Priority for all emergencies
  emergencies.forEach(e => {
    const { priorityScore, priorityReason } = calculateDynamicPriority(e);
    e.priorityScore = priorityScore;
    e.priorityReason = priorityReason;
  });

  // 2. Sort active/pending emergencies by Priority Score descending
  const unhandledEmergencies = emergencies
    .filter(e => e.status !== 'Completed' && e.status !== 'RESOLVED' && e.status !== 'CANCELLED')
    .sort((a, b) => b.priorityScore - a.priorityScore);

  const assignedResourceIds = new Set();
  const newAllocations = [];
  const unassignedEmergencies = [];

  // Track state updates
  for (const emergency of unhandledEmergencies) {
    let bestCandidate = null;
    let highestScore = -Infinity;

    // Evaluate available resources strictly (status must be Available)
    for (const resource of resources) {
      if (assignedResourceIds.has(resource.id)) {
        continue;
      }
      
      const rStatus = (resource.status || '').toUpperCase();
      if (rStatus !== 'AVAILABLE') {
        // Strict Constraint: Busy, Assigned, Travelling, Unavailable cannot be re-assigned automatically
        continue;
      }

      const distanceKm = calculateDistance(
        emergency.latitude,
        emergency.longitude,
        resource.latitude,
        resource.longitude
      );

      const etaMinutes = calculateETA(distanceKm, resource.speed);
      const compatibility = getCompatibilityScore(emergency.requiredResource, resource.type, resource.capabilities || []);
      const weatherPenalty = getWeatherRiskPenalty(weather, resource.type, emergency.accessibility);

      // Require minimum baseline suitability & capacity check
      if (compatibility < 20) {
        continue;
      }

      const score = calculateScore({
        priorityScore: emergency.priorityScore,
        compatibility,
        distanceKm,
        etaMinutes,
        weatherRiskPenalty: weatherPenalty
      });

      if (score > highestScore) {
        highestScore = score;
        bestCandidate = {
          resource,
          distanceKm,
          etaMinutes,
          score,
          compatibility
        };
      }
    }

    if (bestCandidate) {
      const { resource, distanceKm, etaMinutes, score } = bestCandidate;
      assignedResourceIds.add(resource.id);

      // Update in-memory statuses
      resource.status = 'Assigned';
      resource.currentEmergencyId = emergency.id;
      emergency.status = 'Assigned';

      const reasons = [
        emergency.priorityReason,
        `Matched suitable ${resource.name} (${resource.type})`,
        `Capacity: ${resource.capacity} | Distance: ${distanceKm} km | ETA: ${etaMinutes} mins`,
        `Route accessibility: ${emergency.accessibility}`
      ];

      newAllocations.push({
        emergencyId: emergency.id,
        emergencyTitle: emergency.title,
        priorityScore: emergency.priorityScore,
        priorityReason: emergency.priorityReason,
        severity: emergency.severity || emergency.urgency,
        peopleAffected: emergency.peopleAffected,
        resourceId: resource.id,
        resourceName: resource.name,
        resourceType: resource.type,
        resourceStatus: resource.status,
        distanceKm,
        eta: etaMinutes,
        score,
        reasons,
        approvalStatus: 'APPROVED' // Default auto-approved
      });
    } else {
      // Rule: Keep emergency in Waiting status if no resource available
      emergency.status = 'Waiting';
      unassignedEmergencies.push({
        emergencyId: emergency.id,
        emergencyTitle: emergency.title,
        priorityScore: emergency.priorityScore,
        priorityReason: emergency.priorityReason,
        requiredResource: emergency.requiredResource,
        peopleAffected: emergency.peopleAffected,
        status: 'Waiting',
        reason: 'NO SUITABLE RESOURCE AVAILABLE'
      });
    }
  }

  // 3. Plan Versioning
  const history = mockData.getPlanHistory();
  const previousPlan = history.length > 0 ? history[history.length - 1] : null;
  const nextVersionNumber = history.length + 1;
  const versionTag = `PLAN V${nextVersionNumber}`;

  // Detect delta changes from previous version
  const changesFromPrevious = [];
  if (previousPlan) {
    const prevMap = {};
    (previousPlan.allocations || []).forEach(a => { prevMap[a.emergencyId] = a; });

    newAllocations.forEach(na => {
      const prev = prevMap[na.emergencyId];
      const prevResource = prev ? prev.resourceName : 'Unassigned / Waiting';

      if (prevResource !== na.resourceName) {
        changesFromPrevious.push({
          emergencyId: na.emergencyId,
          emergencyTitle: na.emergencyTitle,
          oldResource: prevResource,
          newResource: na.resourceName,
          priorityScore: na.priorityScore,
          reasons: na.reasons
        });
      }
    });

    // Check emergencies that became waiting
    unassignedEmergencies.forEach(ue => {
      const prev = prevMap[ue.emergencyId];
      if (prev && prev.resourceName) {
        changesFromPrevious.push({
          emergencyId: ue.emergencyId,
          emergencyTitle: ue.emergencyTitle,
          oldResource: prev.resourceName,
          newResource: 'Waiting (NO SUITABLE RESOURCE AVAILABLE)',
          priorityScore: ue.priorityScore,
          reasons: [ue.reason]
        });
      }
    });
  }

  const newPlanVersion = {
    version: versionTag,
    timestamp: new Date().toISOString(),
    triggerEvent,
    allocations: newAllocations,
    unassignedEmergencies,
    changesFromPrevious
  };

  history.push(newPlanVersion);
  mockData.setPlanHistory(history);
  mockData.setAllocations(newAllocations);

  return {
    planVersion: newPlanVersion,
    allocations: newAllocations,
    unassignedEmergencies,
    changesFromPrevious
  };
}

module.exports = {
  runAllocationEngine
};
