import React from "react";
import { AlertCircle, Bell, Info, AlertTriangle } from "lucide-react";

export function AlertCard({ alert }) {
  if (!alert) return null;

  const getTypeIcon = () => {
    switch (alert.type) {
      case "CRITICAL":
        return <AlertCircle className="alert-icon-critical" size={18} />;
      case "WARNING":
        return <AlertTriangle className="alert-icon-warning" size={18} />;
      case "INFO":
      default:
        return <Info className="alert-icon-info" size={18} />;
    }
  };

  return (
    <div className={`alert-card alert-border-${(alert.type || "INFO").toLowerCase()}`}>
      <div className="alert-card-header">
        <div className="alert-title-wrapper">
          {getTypeIcon()}
          <h4 className="alert-title">{alert.title}</h4>
        </div>
        <span className="alert-timestamp">{alert.timestamp}</span>
      </div>
      <p className="alert-message">{alert.message}</p>
    </div>
  );
}

export default AlertCard;
