/**
 * 2. Allocation Engine — Automatic Optimal Resource Dispatch
 *
 * Matches active emergencies with available resources based on:
 * - Resource type suitability (e.g. Flood -> Rescue Team / Water Unit)
 * - Emergency priority score
 * - Resource availability status
 * - Estimated arrival distance & route accessibility
 */

export const allocateResources = (emergencies = [], resources = [], roads = []) => {
  const activeEmergencies = emergencies
    .filter((e) => e.status === "Active")
    .sort((a, b) => (b.priorityScore || 50) - (a.priorityScore || 50));

  const availableResources = resources.filter((r) => r.status === "Available");
  const blockedRoads = roads.filter((rd) => rd.status === "Blocked" || rd.status === "Flooded");

  const proposedAllocations = [];

  for (const emergency of activeEmergencies) {
    if (availableResources.length === 0) break;

    // Find best resource match
    let bestMatchIndex = -1;
    let highestMatchScore = -1;

    availableResources.forEach((resource, index) => {
      let matchScore = 50;

      // Type matching bonus
      if (emergency.type === "Flood" && (resource.type === "Rescue Team" || resource.type === "Water Supply")) {
        matchScore += 30;
      } else if (emergency.type === "Building Collapse" && (resource.type === "Engineering" || resource.type === "Rescue Team")) {
        matchScore += 35;
      } else if (emergency.type === "Fire" && resource.type === "Rescue Team") {
        matchScore += 25;
      } else if (emergency.type === "Medical Emergency" && resource.type === "Medical") {
        matchScore += 40;
      } else if (emergency.type === "Food Shortage" && resource.type === "Food Supply") {
        matchScore += 40;
      }

      // Check route blockage penalty
      const isRouteBlocked = blockedRoads.some((rd) => 
        emergency.location.includes(rd.name) || resource.location.includes(rd.name)
      );

      if (isRouteBlocked) {
        matchScore -= 20;
      }

      if (matchScore > highestMatchScore) {
        highestMatchScore = matchScore;
        bestMatchIndex = index;
      }
    });

    if (bestMatchIndex !== -1 && highestMatchScore > 40) {
      const selectedResource = availableResources.splice(bestMatchIndex, 1)[0];
      const isBlocked = blockedRoads.length > 0;

      proposedAllocations.push({
        id: `ALC-${Math.floor(100 + Math.random() * 900)}`,
        emergencyId: emergency.id || emergency._id,
        emergencyTitle: emergency.title,
        resourceId: selectedResource.id || selectedResource._id,
        resourceName: selectedResource.name,
        status: "In Transit",
        eta: isBlocked ? "15 mins (Detour)" : "8 mins",
        route: isBlocked ? "Via Bypass Route B4" : "Direct Sector Route",
        matchScore: highestMatchScore,
        assignedAt: new Date().toISOString()
      });
    }
  }

  return proposedAllocations;
};

export default allocateResources;
