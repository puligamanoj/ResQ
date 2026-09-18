import React from "react";
import { AlertTriangle, CheckCircle, Navigation } from "lucide-react";

export function RoadStatus({ road }) {
  if (!road) return null;

  const isBlocked = road.status === "Blocked" || road.status === "Flooded";

  return (
    <div className={`road-status-card ${isBlocked ? "road-blocked" : "road-clear"}`}>
      <div className="road-header">
        <div className="road-title">
          {isBlocked ? (
            <AlertTriangle className="road-icon-blocked" size={18} />
          ) : (
            <CheckCircle className="road-icon-clear" size={18} />
          )}
          <h4>{road.name}</h4>
        </div>
        <span className={`road-badge ${isBlocked ? "badge-danger" : "badge-success"}`}>
          {road.status}
        </span>
      </div>

      <div className="road-details">
        {isBlocked && (
          <>
            <p className="road-cause"><b>Cause:</b> {road.cause}</p>
            <p className="road-alt">
              <Navigation size={13} /> <b>Alternative:</b> {road.alternativeRoute}
            </p>
            <p className="road-impact"><b>Delay Impact:</b> {road.delayImpact}</p>
          </>
        )}
        {!isBlocked && <p className="road-clear-text">Route open for all emergency vehicles.</p>}
      </div>
    </div>
  );
}

export default RoadStatus;
