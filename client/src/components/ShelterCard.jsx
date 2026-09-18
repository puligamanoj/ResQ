import React from "react";
import { Home, MapPin, Users, PackageCheck, Phone } from "lucide-react";

export function ShelterCard({ shelter }) {
  if (!shelter) return null;

  const occupancyPercent = Math.round((shelter.occupied / shelter.capacity) * 100);
  const isFull = occupancyPercent >= 90;

  return (
    <div className="shelter-card">
      <div className="shelter-card-header">
        <div className="shelter-title">
          <Home size={18} className="shelter-icon" />
          <h3>{shelter.name}</h3>
        </div>
        <span className={`shelter-badge ${isFull ? "shelter-full" : "shelter-open"}`}>
          {isFull ? "Near Capacity" : "Accepting People"}
        </span>
      </div>

      <div className="shelter-body">
        <div className="detail-item">
          <MapPin size={14} />
          <span>{shelter.location}</span>
        </div>

        <div className="capacity-container">
          <div className="capacity-info">
            <div className="detail-item">
              <Users size={14} />
              <span><b>{shelter.occupied}</b> / {shelter.capacity} Occupied</span>
            </div>
            <span className="occupancy-pct">{occupancyPercent}%</span>
          </div>
          <div className="capacity-bar-track">
            <div 
              className={`capacity-bar-fill ${isFull ? "bar-critical" : "bar-normal"}`}
              style={{ width: `${Math.min(occupancyPercent, 100)}%` }}
            />
          </div>
        </div>

        {shelter.supplies && (
          <div className="detail-item mt-2">
            <PackageCheck size={14} />
            <span>Supplies: <b>{shelter.supplies}</b></span>
          </div>
        )}

        {shelter.contact && (
          <div className="detail-item">
            <Phone size={14} />
            <span>Contact: {shelter.contact}</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default ShelterCard;
