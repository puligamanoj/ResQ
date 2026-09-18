import React from "react";
import { AlertOctagon, ShieldAlert, Users, Home, AlertTriangle } from "lucide-react";

export function DisasterStatus({ disaster }) {
  if (!disaster) return null;

  return (
    <div className="disaster-status-banner">
      <div className="disaster-banner-header">
        <div className="disaster-title-group">
          <AlertOctagon size={24} className="disaster-alert-icon" />
          <div>
            <h2 className="disaster-name">{disaster.name}</h2>
            <p className="disaster-region">{disaster.region} — Level: <b>{disaster.level}</b></p>
          </div>
        </div>
        <div className="disaster-badge-critical">
          {disaster.status}
        </div>
      </div>

      <div className="disaster-metrics-row">
        <div className="disaster-metric">
          <Users size={16} />
          <div>
            <span className="metric-num">{disaster.affectedCount}</span>
            <span className="metric-lbl">People Affected</span>
          </div>
        </div>

        <div className="disaster-metric">
          <Home size={16} />
          <div>
            <span className="metric-num">{disaster.activeShelters}</span>
            <span className="metric-lbl">Active Shelters</span>
          </div>
        </div>

        <div className="disaster-metric">
          <AlertTriangle size={16} />
          <div>
            <span className="metric-num">{disaster.blockedRoadsCount}</span>
            <span className="metric-lbl">Blocked Routes</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DisasterStatus;
