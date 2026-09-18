import React from "react";
import Navbar from "../components/Navbar";
import { Activity, ShieldAlert, AlertTriangle, TrendingUp, BarChart2 } from "lucide-react";

export function RiskAnalysis() {
  const riskZones = [
    { zone: "Area A — Low Basin", vulnerability: "94%", riskLevel: "EXTREME", mainThreat: "Flood & Overflow", popDensity: "High (12k/km²)" },
    { zone: "Area C — Commercial Slope", vulnerability: "82%", riskLevel: "HIGH", mainThreat: "Landslide & Structural Failure", popDensity: "Medium (8k/km²)" },
    { zone: "Area B — Valley Center", vulnerability: "65%", riskLevel: "MEDIUM", mainThreat: "Isolation & Supply Cutoff", popDensity: "Medium (6k/km²)" },
    { zone: "Area D — East Bay Heights", vulnerability: "30%", riskLevel: "LOW", mainThreat: "Wind & Storm Surge", popDensity: "Low (3k/km²)" }
  ];

  return (
    <div className="app-layout">
      <Navbar />

      <main className="main-content">
        <div className="page-header">
          <div>
            <h1 className="page-title">Predictive Risk Analysis & Vulnerability</h1>
            <p className="page-subtitle">AI-driven risk assessment, threat forecasting, and hazard analytics</p>
          </div>
        </div>

        <div className="stats-grid">
          <div className="stat-card stat-critical">
            <div className="stat-card-header">
              <span className="stat-title">Peak Vulnerability Zone</span>
              <ShieldAlert size={20} />
            </div>
            <h2 className="stat-value">Area A Basin</h2>
            <p className="stat-subtitle">94% Risk Score</p>
          </div>

          <div className="stat-card stat-warning">
            <div className="stat-card-header">
              <span className="stat-title">Estimated Rainfall Surge</span>
              <TrendingUp size={20} />
            </div>
            <h2 className="stat-value">+140 mm</h2>
            <p className="stat-subtitle">Next 12 Hours</p>
          </div>

          <div className="stat-card stat-danger">
            <div className="stat-card-header">
              <span className="stat-title">Population at Immediate Risk</span>
              <AlertTriangle size={20} />
            </div>
            <h2 className="stat-value">1,250</h2>
            <p className="stat-subtitle">In Sectors A & C</p>
          </div>
        </div>

        <div className="info-panel mt-4">
          <h2><BarChart2 size={20} className="text-primary" /> Sector Risk Assessment Matrix</h2>
          <div className="table-responsive mt-3">
            <table className="standard-table">
              <thead>
                <tr>
                  <th>Zone / Region</th>
                  <th>Vulnerability Index</th>
                  <th>Threat Level</th>
                  <th>Primary Threat Vector</th>
                  <th>Population Density</th>
                </tr>
              </thead>
              <tbody>
                {riskZones.map((z, idx) => (
                  <tr key={idx}>
                    <td><b>{z.zone}</b></td>
                    <td>
                      <div className="vulnerability-bar-wrapper">
                        <span>{z.vulnerability}</span>
                        <div className="mini-track">
                          <div className="mini-fill" style={{ width: z.vulnerability }}></div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className={`priority-badge ${z.riskLevel === "EXTREME" ? "badge-critical" : `badge-${z.riskLevel.toLowerCase()}`}`}>
                        {z.riskLevel}
                      </span>
                    </td>
                    <td>{z.mainThreat}</td>
                    <td>{z.popDensity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}

export default RiskAnalysis;
