/**
 * 3. Dynamic Replanning Engine ⭐
 *
 * Triggers when:
 * - A new high-priority emergency arrives
 * - A road gets blocked / flooded
 * - A resource becomes unavailable
 * - A shelter reaches max capacity
 *
 * Recalculates current allocations, diverts resources if needed, and returns updated allocations + decision explanations.
 */

import calculatePriority from "./priorityEngine.js";
import allocateResources from "./allocationEngine.js";

export const triggerReplanning = (triggerEvent, currentEmergencies = [], currentResources = [], currentRoads = []) => {
  // Step 1: Recalculate dynamic priority scores for all active emergencies
  const updatedEmergencies = currentEmergencies.map((emg) => {
    const priorityCalc = calculatePriority(emg);
    return {
      ...emg,
      priorityScore: priorityCalc.priorityScore,
      priorityRank: priorityCalc.priorityRank,
    };
  });

  // Step 2: Identify any road blockages
  const blockedRoads = currentRoads.filter((r) => r.status === "Blocked" || r.status === "Flooded");

  // Step 3: Run allocation engine for optimal dispatch
  const freshAllocations = allocateResources(updatedEmergencies, currentResources, currentRoads);

  // Step 4: Generate natural language decision explanations
  const decisionExplanations = [];

  if (blockedRoads.length > 0) {
    blockedRoads.forEach((rd) => {
      decisionExplanations.push({
        id: `DEC-${Math.floor(10 + Math.random() * 90)}`,
        triggerEvent: `${rd.name} ${rd.status} (${rd.cause || "Hazard"})`,
        affectedDispatch: `Units passing near ${rd.name}`,
        aiRecommendation: `Divert via ${rd.alternativeRoute || "Bypass Route B4"}`,
        reasoning: `Primary arterial ${rd.name} is ${rd.status.toLowerCase()}. Diverting units avoids estimated ${rd.delayImpact || "+15 mins"} delay while keeping response time optimal.`,
        confidenceScore: "96%"
      });
    });
  }

  const criticalEmergency = updatedEmergencies.find((e) => e.priorityScore >= 85);
  if (criticalEmergency) {
    decisionExplanations.push({
      id: `DEC-${Math.floor(10 + Math.random() * 90)}`,
      triggerEvent: `High Priority Surge: ${criticalEmergency.title} (Priority ${criticalEmergency.priorityScore})`,
      affectedDispatch: `Primary Rescue Assets`,
      aiRecommendation: `Prioritize immediate unit dispatch to ${criticalEmergency.location}`,
      reasoning: `Emergency score (${criticalEmergency.priorityScore}) exceeds critical threshold. Priority Engine re-ranked this incident to top tier due to high vulnerable count and time waiting.`,
      confidenceScore: "98%"
    });
  }

  return {
    success: true,
    triggerEvent: triggerEvent || "System Dynamic Recalculation",
    recalculatedEmergencies: updatedEmergencies,
    newAllocations: freshAllocations,
    decisionExplanations,
    timestamp: new Date().toISOString()
  };
};

export default triggerReplanning;
