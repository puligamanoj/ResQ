import React from "react";

export function StatCard({ title, value, subtitle, icon: Icon, colorClass = "stat-neutral", trend }) {
  return (
    <div className={`stat-card ${colorClass}`}>
      <div className="stat-card-header">
        <span className="stat-title">{title}</span>
        {Icon && <Icon className="stat-icon" size={20} />}
      </div>
      <div className="stat-card-body">
        <h2 className="stat-value">{value}</h2>
        {subtitle && <p className="stat-subtitle">{subtitle}</p>}
        {trend && <span className="stat-trend">{trend}</span>}
      </div>
    </div>
  );
}

export default StatCard;
