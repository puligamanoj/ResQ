import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import AlertCard from "../components/AlertCard";
import disasterService from "../services/disasterService";
import { Bell, Filter, ShieldAlert } from "lucide-react";

export function Alerts() {
  const [alerts, setAlerts] = useState([]);
  const [filterType, setFilterType] = useState("ALL");

  useEffect(() => {
    const loadAlerts = async () => {
      const data = await disasterService.getAlerts();
      setAlerts(data);
    };
    loadAlerts();
  }, []);

  const filteredAlerts = alerts.filter(
    (a) => filterType === "ALL" || a.type === filterType
  );

  return (
    <div className="app-layout">
      <Navbar />

      <main className="main-content">
        <div className="page-header">
          <div>
            <h1 className="page-title">System Alerts & Notifications</h1>
            <p className="page-subtitle">Real-time broadcast alerts, automated system warnings, and operational dispatches</p>
          </div>
        </div>

        <div className="filter-bar">
          <div className="filter-group">
            <Filter size={16} />
            <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
              <option value="ALL">All Severity Levels</option>
              <option value="CRITICAL">Critical Only</option>
              <option value="WARNING">Warnings</option>
              <option value="INFO">Informational</option>
            </select>
          </div>
        </div>

        <div className="alerts-full-list">
          {filteredAlerts.map((alert) => (
            <AlertCard key={alert.id} alert={alert} />
          ))}
        </div>
      </main>
    </div>
  );
}

export default Alerts;
