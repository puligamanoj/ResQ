/**
 * Dynamic Priority & Scoring Utilities for RESQ Serving Resource Allocation Module
 */

function calculateDynamicPriority(emergency) {
  const urgency = (emergency.urgency || emergency.severity || 'MEDIUM').toUpperCase();
  const people = Number(emergency.peopleAffected) || 1;
  const vulnerable = Number(emergency.vulnerablePeople) || 0;
  const isMedical = Boolean(emergency.medicalRequirement) || (emergency.requiredResource || '').toLowerCase().includes('medical') || (emergency.requiredResource || '').toLowerCase().includes('ambulance');

  let baseUrgencyScore = 20;
  if (urgency === 'CRITICAL') baseUrgencyScore = 40;
  else if (urgency === 'HIGH') baseUrgencyScore = 30;
  else if (urgency === 'MEDIUM') baseUrgencyScore = 20;
  else if (urgency === 'LOW') baseUrgencyScore = 10;

  const medicalScore = isMedical ? 20 : 0;
  const peopleScore = Math.min(20, Math.round(people * 0.5));
  const vulnerableScore = Math.min(15, Math.round(vulnerable * 2.5));
  const accessBonus = emergency.accessibility === 'BLOCKED' || emergency.accessibility === 'PARTIAL' ? 5 : 0;

  const rawScore = baseUrgencyScore + medicalScore + peopleScore + vulnerableScore + accessBonus;
  const priorityScore = Math.max(1, Math.min(100, rawScore));

  // Build transparent human-readable explanation string
  const reasons = [];
  reasons.push(`${urgency} urgency (${baseUrgencyScore} pts)`);
  if (isMedical) reasons.push(`medical requirement present (+20 pts)`);
  if (vulnerable > 0) reasons.push(`${vulnerable} vulnerable persons (+${vulnerableScore} pts)`);
  reasons.push(`${people} total affected people (+${peopleScore} pts)`);
  if (accessBonus > 0) reasons.push(`road access status: ${emergency.accessibility}`);

  const priorityReason = `Priority ${priorityScore}: ${reasons.join(', ')}.`;

  return {
    priorityScore,
    priorityReason
  };
}

function getSeverityScore(severity) {
  switch ((severity || '').toUpperCase()) {
    case 'CRITICAL': return 100;
    case 'HIGH': return 75;
    case 'MEDIUM': return 50;
    case 'LOW': return 25;
    default: return 50;
  }
}

function getPeopleAffectedScore(peopleAffected) {
  const count = Number(peopleAffected) || 1;
  return Math.min(100, Math.round(count * 1.5));
}

function getAccessibilityScore(accessibility) {
  switch ((accessibility || '').toUpperCase()) {
    case 'ACCESSIBLE': return 100;
    case 'PARTIAL': return 50;
    case 'BLOCKED': return 0;
    default: return 75;
  }
}

function getCompatibilityScore(requiredResource, resourceType, resourceCapabilities = []) {
  const req = (requiredResource || '').toLowerCase().trim();
  const res = (resourceType || '').toLowerCase().trim();

  if (req === res) return 100;

  if (req.includes('boat') && res.includes('boat')) return 100;
  if (req.includes('boat') && (res.includes('team') || resourceCapabilities.includes('water_rescue'))) return 80;
  if (req.includes('fire') && res.includes('fire')) return 100;
  if (req.includes('medical') && (res.includes('ambulance') || res.includes('medical'))) return 100;
  if (req.includes('team') && (res.includes('team') || res.includes('boat'))) return 80;

  return 20;
}

function getWeatherRiskPenalty(weather, resourceType, accessibility) {
  let penalty = 0;
  const isSevere = weather && (weather.riskLevel === 'HIGH' || weather.riskLevel === 'SEVERE' || weather.rainfall > 50);
  const resLower = (resourceType || '').toLowerCase();

  if (isSevere) {
    if (resLower.includes('ambulance') || resLower.includes('truck')) {
      penalty += 35;
    }
  }

  if (accessibility === 'BLOCKED' && !resLower.includes('boat')) {
    penalty += 50;
  }

  return penalty;
}

function calculateETA(distanceKm, speedKmh) {
  const speed = speedKmh && speedKmh > 0 ? speedKmh : 40;
  const hours = distanceKm / speed;
  const minutes = Math.round(hours * 60);
  return Math.max(2, minutes);
}

function calculateScore({ priorityScore, compatibility, distanceKm, etaMinutes, weatherRiskPenalty }) {
  const distancePenalty = Math.min(30, distanceKm * 2.5);
  const responseTimePenalty = Math.min(20, etaMinutes * 1.0);

  let totalScore = 
    (priorityScore * 0.40) +
    (compatibility * 0.40) -
    distancePenalty -
    responseTimePenalty -
    weatherRiskPenalty;

  return Math.max(1, Math.min(100, Math.round(totalScore)));
}

module.exports = {
  calculateDynamicPriority,
  getSeverityScore,
  getPeopleAffectedScore,
  getAccessibilityScore,
  getCompatibilityScore,
  getWeatherRiskPenalty,
  calculateETA,
  calculateScore
};
