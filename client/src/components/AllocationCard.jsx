import React from "react";
import { ArrowRight, Clock, Navigation, CheckCircle2, AlertTriangle } from "lucide-react";

export function AllocationCard({ allocation }) {
  if (!allocation) return null;

  return (
    <div className="allocation-card">
      <div className="allocation-header">
        <span className="allocation-id">{allocation.id}</span>
        <span className="allocation-status-badge">
          {allocation.status === "On Site" ? (
            <>
              <CheckCircle2 size={12} /> {allocation.status}
            </>
          ) : (
            <>
              <Navigation size={12} className="spinning-icon" /> {allocation.status}
            </>
          )}
        </span>
      </div>

      <div className="allocation-route-display">
        <div className="allocation-node">
          <span className="node-label">Resource</span>
          <strong className="node-value">{allocation.resourceName}</strong>
        </div>

        <ArrowRight size={18} className="route-arrow" />

        <div className="allocation-node">
          <span className="node-label">Emergency Target</span>
          <strong className="node-value">{allocation.emergencyTitle}</strong>
        </div>
      </div>

      <div className="allocation-meta">
        <div className="meta-item">
          <Clock size={14} />
          <span>ETA: <b>{allocation.eta}</b></span>
        </div>
        <div className="meta-item">
          <Navigation size={14} />
          <span>Route: {allocation.route}</span>
        </div>
      </div>
    </div>
  );
}

export default AllocationCard;
