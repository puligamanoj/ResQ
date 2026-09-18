import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import StatCard from "../components/StatCard";
import DisasterStatus from "../components/DisasterStatus";
import EmergencyCard from "../components/EmergencyCard";
import AlertCard from "../components/AlertCard";
import emergencyService from "../services/emergencyService";
import disasterService from "../services/disasterService";
import resourceService from "../services/resourceService";
import { AlertCircle, AlertTriangle, Truck, Users, Plus, Activity } from "lucide-react";

export function Dashboard() {
  const [emergencies, setEmergencies] = useState([]);
  const [disasterInfo, setDisasterInfo] = useState(null);
  const [resources, setResources] = useState([]);
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const emgData = await emergencyService.getEmergencies();
      const disData = await disasterService.getDisasterInfo();
      const resData = await resourceService.getResources();
      const altData = await disasterService.getAlerts();

      setEmergencies(emgData);
      setDisasterInfo(disData.disaster);
      setResources(resData);
      setAlerts(altData);
    };

    fetchData();
  }, []);

  const criticalCases = emergencies.filter((e) => e.urgency === "CRITICAL").length;
  const availableResources = resources.filter((r) => r.status === "Available").length;
  const activeTeams = resources.filter((r) => r.status === "Deployed").length;

  return (
    <div className="app-layout">
      <Navbar />

      <main className="main-content">
        <div className="page-header">
          <div>
            <h1 className="page-title">Disaster Command Center</h1>
            <p className="page-subtitle">Real-time emergency response coordination & operational overview</p>
          </div>

          <Link to="/emergency" className="btn-primary">
            <Plus size={18} /> Report Emergency
          </Link>
        </div>

        {disasterInfo && <DisasterStatus disaster={disasterInfo} />}

        <div className="stats-grid">
          <StatCard
            title="Active Emergencies"
            value={emergencies.length}
            subtitle="Currently tracked"
            icon={AlertCircle}
            colorClass="stat-danger"
          />

          <StatCard
            title="Critical Cases"
            value={criticalCases}
            subtitle="Immediate dispatch required"
            icon={AlertTriangle}
            colorClass="stat-critical"
          />

          <StatCard
            title="Available Resources"
            value={availableResources}
            subtitle="Ready for deployment"
            icon={Truck}
            colorClass="stat-success"
          />

          <StatCard
            title="Active Deployed Teams"
            value={activeTeams}
            subtitle="Operations ongoing"
            icon={Users}
            colorClass="stat-warning"
          />
        </div>

        <div className="dashboard-grid">
          <section className="dashboard-section">
            <div className="section-header">
              <h2>Active Emergencies</h2>
              <span className="badge-live">LIVE updates</span>
            </div>

            <div className="emergency-cards-list">
              {emergencies.slice(0, 4).map((emergency) => (
                <EmergencyCard key={emergency.id} emergency={emergency} />
              ))}
            </div>
          </section>

          <section className="dashboard-section">
            <div className="section-header">
              <h2>System Alerts & Feed</h2>
              <Link to="/alerts" className="view-all-link">View All</Link>
            </div>

            <div className="alerts-list">
              {alerts.map((alert) => (
                <AlertCard key={alert.id} alert={alert} />
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;