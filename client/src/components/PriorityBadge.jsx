import React from "react";

export function PriorityBadge({ level }) {
  const normalizedLevel = (level || "LOW").toUpperCase();

  const getBadgeClass = () => {
    switch (normalizedLevel) {
      case "CRITICAL":
        return "badge-critical";
      case "HIGH":
        return "badge-high";
      case "MEDIUM":
        return "badge-medium";
      case "LOW":
      default:
        return "badge-low";
    }
  };

  return <span className={`priority-badge ${getBadgeClass()}`}>{normalizedLevel}</span>;
}

export default PriorityBadge;
