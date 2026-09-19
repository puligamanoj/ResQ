/**
 * 1. Priority Engine — Dynamic Priority Calculation
 *
 * Formula:
 * Priority Score = Urgency (30%) + People Affected (20%) + Vulnerability (20%) + Accessibility (15%) + Waiting Time (15%)
 */

export const calculatePriority = (emergency) => {
  // Normalize Urgency to 0 - 10 scale
  let urgencyScore = 5;
  if (typeof emergency.urgency === "number") {
    urgencyScore = emergency.urgency;
  } else if (typeof emergency.urgency === "string") {
    const u = emergency.urgency.toUpperCase();
    if (u === "CRITICAL") urgencyScore = 10;
    else if (u === "HIGH") urgencyScore = 8;
    else if (u === "MEDIUM") urgencyScore = 5;
    else if (u === "LOW") urgencyScore = 2;
  }

  // Normalize People Affected (0 - 10 scale)
  const peopleCount = emergency.affectedPeople || emergency.peopleAffected || 1;
  let peopleScore = Math.min(10, Math.ceil(peopleCount / 10));

  // Normalize Vulnerability (ratio of children / elderly to total affected)
  const vulnerableCount = emergency.vulnerablePeople || 0;
  let vulnerabilityScore = Math.min(10, Math.ceil((vulnerableCount / (peopleCount || 1)) * 10));
  if (vulnerableCount > 0 && vulnerabilityScore < 3) vulnerabilityScore = 4;

  // Accessibility Score (0 - 10 scale, 10 = perfectly accessible road, 2 = heavily blocked)
  let accessibilityScore = emergency.accessibilityScore !== undefined ? emergency.accessibilityScore : 8;

  // Waiting Time Score (10 mins = 2, 60+ mins = 10)
  let waitingTimeMinutes = emergency.waitingTimeMinutes || emergency.waitingTime || 0;
  let waitingScore = Math.min(10, Math.ceil(waitingTimeMinutes / 10));

  // Dynamic Priority Formula
  const finalScoreRaw =
    urgencyScore * 0.30 +
    peopleScore * 0.20 +
    vulnerabilityScore * 0.20 +
    accessibilityScore * 0.15 +
    waitingScore * 0.15;

  const priorityScore = Math.min(100, Math.max(10, Math.round(finalScoreRaw * 10)));

  // Derive Rank
  let priorityRank = "LOW";
  if (priorityScore >= 80) priorityRank = "CRITICAL";
  else if (priorityScore >= 65) priorityRank = "HIGH";
  else if (priorityScore >= 45) priorityRank = "MEDIUM";

  return {
    priorityScore,
    priorityRank,
    breakdown: {
      urgencyScore,
      peopleScore,
      vulnerabilityScore,
      accessibilityScore,
      waitingScore,
    }
  };
};

export default calculatePriority;
