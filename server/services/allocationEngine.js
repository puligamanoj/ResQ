/**
 * Allocation Engine — Dynamic Resource Allocation & Recommendation
 */

function calculateDistance(lat1, lon1, lat2, lon2) {
  if (!lat1 || !lon1 || !lat2 || !lon2) return 5.0; // Default fallback distance in km

  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return Math.round(distance * 10) / 10;
}

function recommendResource(emergency, availableResources = [], roads = []) {
  // Filter available and online resources
  const validResources = availableResources.filter(
    (r) => r.available === true && r.status === 'AVAILABLE'
  );

  if (validResources.length === 0) {
    return {
      resource: null,
      score: 0,
      distance: 0,
      reason: 'No available resources currently online',
    };
  }

  const blockedRoadNames = roads
    .filter((rd) => rd.blocked === true)
    .map((rd) => rd.name.toLowerCase());

  let bestResource = null;
  let bestScore = -1;
  let bestDistance = 0;
  let bestReason = '';

  validResources.forEach((resource) => {
    let score = 50; // Base score
    const distance = calculateDistance(
      emergency.latitude,
      emergency.longitude,
      resource.latitude,
      resource.longitude
    );

    // Distance scoring (closer = higher score, max 30 pts)
    const distanceScore = Math.max(0, 30 - Math.round(distance * 2));
    score += distanceScore;

    // Type Matching (+25 pts)
    const eType = (emergency.type || '').toUpperCase();
    const rType = (resource.type || '').toUpperCase();

    let typeMatched = false;
    if (eType.includes('MEDICAL') && rType === 'AMBULANCE') typeMatched = true;
    else if (eType.includes('FIRE') && rType === 'FIRE_TRUCK') typeMatched = true;
    else if (eType.includes('FLOOD') && (rType === 'BOAT' || rType === 'RESCUE_TEAM')) typeMatched = true;
    else if (eType.includes('COLLAPSE') && (rType === 'RESCUE_TEAM' || rType === 'HELICOPTER')) typeMatched = true;
    else if (rType === 'RESCUE_TEAM') typeMatched = true; // General rescue team matches any emergency

    if (typeMatched) score += 25;

    // Capacity Matching (+15 pts)
    const needed = emergency.peopleAffected || 1;
    if (resource.capacity >= needed) {
      score += 15;
    } else {
      score += 5;
    }

    // Road blockage check penalty (-20 pts)
    const isRouteBlocked = blockedRoadNames.some(
      (name) =>
        (emergency.location || '').toLowerCase().includes(name) ||
        (resource.currentLocation || '').toLowerCase().includes(name)
    );

    if (isRouteBlocked) {
      score -= 20;
    }

    score = Math.min(100, Math.max(1, score));

    if (score > bestScore) {
      bestScore = score;
      bestResource = resource;
      bestDistance = distance;

      const reasonParts = [];
      reasonParts.push(`Available ${resource.type.toLowerCase().replace('_', ' ')}`);
      reasonParts.push(`capacity ${resource.capacity}`);
      reasonParts.push(isRouteBlocked ? 'detour required due to road blockage' : 'closest accessible route');

      bestReason = reasonParts.join(', ');
    }
  });

  return {
    resource: bestResource ? bestResource.name : null,
    resourceObj: bestResource,
    score: bestScore,
    distance: bestDistance,
    reason: bestReason,
  };
}

module.exports = { calculateDistance, recommendResource };
