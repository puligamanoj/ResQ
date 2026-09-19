/**
 * 4. Risk Engine — Sector Vulnerability & Predictive Hazard Analytics
 */

export const calculateRiskAreas = () => {
  return [
    {
      zone: "Area A — Low Basin",
      vulnerabilityIndex: "94%",
      riskLevel: "EXTREME",
      primaryThreat: "Flash Flood & River Spill",
      populationDensity: "High (12k/km²)",
      evacuationStatus: "Mandatory Evacuation"
    },
    {
      zone: "Area C — Commercial Slope",
      vulnerabilityIndex: "82%",
      riskLevel: "HIGH",
      primaryThreat: "Landslide & Structural Failure",
      populationDensity: "Medium (8k/km²)",
      evacuationStatus: "High Alert"
    },
    {
      zone: "Area B — Valley Center",
      vulnerabilityIndex: "65%",
      riskLevel: "MEDIUM",
      primaryThreat: "Road Blockage & Supply Cutoff",
      populationDensity: "Medium (6k/km²)",
      evacuationStatus: "Advisory Alert"
    },
    {
      zone: "Area D — East Bay Heights",
      vulnerabilityIndex: "30%",
      riskLevel: "LOW",
      primaryThreat: "Wind Damage",
      populationDensity: "Low (3k/km²)",
      evacuationStatus: "Normal Monitoring"
    }
  ];
};

export default calculateRiskAreas;
