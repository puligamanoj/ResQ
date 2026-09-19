/**
 * Priority Engine — Deterministic Dynamic Priority Calculation
 *
 * Factors:
 * 1. Urgency Rating (CRITICAL: 40 pts, HIGH: 30 pts, MEDIUM: 20 pts, LOW: 10 pts)
 * 2. People Affected (Min(25, peopleAffected * 1.5))
 * 3. Vulnerable People (vulnerablePeople * 3, max 25)
 * 4. Emergency Type Hazard Weight (+10 for Flood/Collapse/Fire)
 * 5. Waiting Time Bonus (minutes elapsed * 0.5, max 10)
 */

function calculatePriority(emergency) {
  let urgencyPts = 20;
  let urgencyText = 'Medium urgency';
  const u = (emergency.urgency || 'HIGH').toUpperCase();

  if (u === 'CRITICAL') {
    urgencyPts = 40;
    urgencyText = 'Critical urgency';
  } else if (u === 'HIGH') {
    urgencyPts = 30;
    urgencyText = 'High urgency';
  } else if (u === 'MEDIUM') {
    urgencyPts = 20;
    urgencyText = 'Medium urgency';
  } else if (u === 'LOW') {
    urgencyPts = 10;
    urgencyText = 'Low urgency';
  }

  const peopleCount = Number(emergency.peopleAffected) || 1;
  const peoplePts = Math.min(25, Math.round(peopleCount * 1.5));

  const vulnerableCount = Number(emergency.vulnerablePeople) || 0;
  const vulnerablePts = Math.min(25, vulnerableCount * 3);

  // Type Hazard Weight
  let typePts = 0;
  const t = (emergency.type || '').toLowerCase();
  if (t.includes('flood') || t.includes('collapse') || t.includes('fire')) {
    typePts = 10;
  }

  // Calculate waiting time in minutes
  let waitingMinutes = 0;
  if (emergency.createdAt) {
    waitingMinutes = Math.floor((Date.now() - new Date(emergency.createdAt).getTime()) / 60000);
  }
  const waitingPts = Math.min(10, Math.floor(waitingMinutes * 0.5));

  const totalRaw = urgencyPts + peoplePts + vulnerablePts + typePts + waitingPts;
  const priorityScore = Math.min(100, Math.max(1, totalRaw));

  // Build human-readable explanation string
  const explanationParts = [];
  explanationParts.push(`${urgencyText} (${urgencyPts} pts)`);
  explanationParts.push(`${peopleCount} people affected (${peoplePts} pts)`);
  if (vulnerableCount > 0) {
    explanationParts.push(`${vulnerableCount} vulnerable people (${vulnerablePts} pts)`);
  }
  if (typePts > 0) {
    explanationParts.push(`Hazard type impact (+${typePts} pts)`);
  }
  if (waitingPts > 0) {
    explanationParts.push(`Waiting time ${waitingMinutes}m (+${waitingPts} pts)`);
  }

  const priorityReason = explanationParts.join(' + ');

  return {
    priorityScore,
    priorityReason,
  };
}

module.exports = { calculatePriority };
