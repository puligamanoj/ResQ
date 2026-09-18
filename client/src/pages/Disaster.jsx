import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import DisasterStatus from "../components/DisasterStatus";
import disasterService from "../services/disasterService";
import { Layers, ShieldAlert, AlertTriangle, Activity } from "lucide-react";

export function Disaster() {
  const [disasterInfo, setDisasterInfo] = useState(null);

  useEffect(() => {
    const loadDisaster = async () => {
      const data = await disasterService.getDisasterInfo();
      setDisasterInfo(data.disaster);
    };
    loadDisaster();
  }, []);

  return (
    <div className="app-layout">
      <Navbar />

      <main className="main-content">
        <div className="page-header">
          <div>
            <h1 className="page-title">Active Disaster Situation</h1>
            <p className="page-subtitle">Disaster declaration, alert levels, and macro environmental context</p>
          </div>
        </div>

        {disasterInfo && <DisasterStatus disaster={disasterInfo} />}

        <div className="disaster-details-grid">
          <div className="info-panel">
            <h2><ShieldAlert size={20} className="text-danger" /> Situation Overview</h2>
            <p>
              A Category 3 Cyclone combined with heavy flash rainfall has impacted the Coastal Metro & Valley region.
              Major river tributaries are operating above emergency spill levels, triggering evacuation protocols in low-lying zones.
            </p>

            <div className="timeline-container">
              <h3>Incident Timeline</h3>
              <ul className="timeline">
                <li>
                  <span className="time">08:00 AM</span>
                  <p>Category 3 Storm warning issued by Meteorological Department.</p>
                </li>
                <li>
                  <span className="time">11:30 AM</span>
                  <p>Flash flood breaches Area A river bank. Command HQ activated.</p>
                </li>
                <li>
                  <span className="time">01:15 PM</span>
                  <p>Highway R17 blocked by mudslide. AI Replanning protocols initiated.</p>
                </li>
                <li>
                  <span className="time">Current</span>
                  <p>Rescue operations underway in Sectors A, B, and C.</p>
                </li>
              </ul>
            </div>
          </div>

          <div className="info-panel">
            <h2><Activity size={20} className="text-warning" /> Command Objectives</h2>
            <ul className="objectives-list">
              <li><b>Priority 1:</b> Life safety evacuations in Area A flood zones.</li>
              <li><b>Priority 2:</b> Debris clearing and structural rescue at Area C collapse site.</li>
              <li><b>Priority 3:</b> Food and clean water distribution to St. Jude & City Indoor shelters.</li>
              <li><b>Priority 4:</b> Maintain clear alternative transport corridors via Bypass Route B4.</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Disaster;
