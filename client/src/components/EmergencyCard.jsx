import React from "react";
import PriorityBadge from "./PriorityBadge";
import { MapPin, Users, Clock, AlertCircle } from "lucide-react";

export function EmergencyCard({ emergency, onSelect }) {
  if (!emergency) return null;

  return (
    <div className="emergency-card">
      <div className="emergency-card-header">
        <div className="emergency-title-box">
          <AlertCircle size={18} className="emergency-card-icon" />
          <h3 className="emergency-title">{emergency.title}</h3>
        </div>
        <PriorityBadge level={emergency.urgency} />
      </div>

      <div className="emergency-card-details">
        <div className="detail-item">
          <MapPin size={14} />
          <span>{emergency.location}</span>
        </div>
        <div className="detail-item">
          <Users size={14} />
          <span>
            <b>{emergency.affectedPeople}</b> affected
            {emergency.vulnerablePeople > 0 && (
              <span className="vulnerable-tag"> ({emergency.vulnerablePeople} vulnerable)</span>
            )}
          </span>
        </div>
        {emergency.reportedAt && (
          <div className="detail-item text-muted">
            <Clock size={14} />
            <span>Reported {emergency.reportedAt}</span>
          </div>
        )}
      </div>

      {emergency.description && (
        <p className="emergency-description">{emergency.description}</p>
      )}

      <div className="emergency-card-footer">
        <span className={`status-pill status-${(emergency.status || "Active").toLowerCase().replace(" ", "-")}`}>
          {emergency.status || "Active"}
        </span>
        {onSelect && (
          <button onClick={() => onSelect(emergency)} className="btn-secondary-sm">
            View Details
          </button>
        )}
      </div>
    </div>
  );
}

export default EmergencyCard;
