import React from "react";
import { Truck, MapPin, Phone, Shield, Clock } from "lucide-react";

export function ResourceCard({ resource, onDeploy }) {
  if (!resource) return null;

  const isAvailable = resource.status === "Available";

  return (
    <div className="resource-card-container">
      <div className="resource-card-header">
        <div className="resource-title-wrapper">
          <Truck size={18} className="resource-icon" />
          <div>
            <h3 className="resource-name">{resource.name}</h3>
            <span className="resource-type">{resource.type}</span>
          </div>
        </div>
        <span className={`status-badge ${isAvailable ? "status-available" : "status-deployed"}`}>
          {resource.status}
        </span>
      </div>

      <div className="resource-card-body">
        <div className="resource-meta-row">
          <MapPin size={14} />
          <span><b>Location:</b> {resource.location}</span>
        </div>
        {resource.capacity && (
          <div className="resource-meta-row">
            <Shield size={14} />
            <span><b>Capacity:</b> {resource.capacity}</span>
          </div>
        )}
        {resource.eta && (
          <div className="resource-meta-row">
            <Clock size={14} />
            <span><b>ETA / Status:</b> {resource.eta}</span>
          </div>
        )}
        {resource.contact && (
          <div className="resource-meta-row">
            <Phone size={14} />
            <span><b>Contact:</b> {resource.contact}</span>
          </div>
        )}
      </div>

      {onDeploy && (
        <div className="resource-card-footer">
          <button
            onClick={() => onDeploy(resource)}
            disabled={!isAvailable}
            className={`btn-full ${isAvailable ? "btn-primary" : "btn-disabled"}`}
          >
            {isAvailable ? "Dispatch Resource" : "Currently Deployed"}
          </button>
        </div>
      )}
    </div>
  );
}

export default ResourceCard;
