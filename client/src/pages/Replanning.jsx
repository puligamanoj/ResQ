import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import RoadStatus from "../components/RoadStatus";
import DecisionExplanation from "../components/DecisionExplanation";
import disasterService from "../services/disasterService";
import { Navigation, RefreshCw, AlertTriangle } from "lucide-react";

export function Replanning() {
  const [roads, setRoads] = useState([]);
  const [decisions, setDecisions] = useState([]);
  const [isReplanning, setIsReplanning] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const roadData = await disasterService.getRoadStatus();
      const decData = await disasterService.getReplanningDecisions();
      setRoads(roadData);
      setDecisions(decData);
    };
    fetchData();
  }, []);

  const handleTriggerReplanning = () => {
    setIsReplanning(true);
    setTimeout(() => {
      setIsReplanning(false);
    }, 1500);
  };

  return (
    <div className="app-layout">
      <Navbar />

      <main className="main-content">
        <div className="page-header">
          <div>
            <h1 className="page-title">Dynamic Route Replanning</h1>
            <p className="page-subtitle">Real-time route obstruction monitoring and automated dispatch re-routing</p>
          </div>

          <button onClick={handleTriggerReplanning} className="btn-primary">
            <RefreshCw size={16} className={isReplanning ? "spinning-icon" : ""} /> Run AI Re-route Engine
          </button>
        </div>

        <div className="two-column-layout">
          <div className="list-column">
            <h2>Tracked Road Networks & Obstructions</h2>
            <div className="roads-list">
              {roads.map((road) => (
                <RoadStatus key={road.id} road={road} />
              ))}
            </div>
          </div>

          <div className="list-column">
            <h2>AI Replanning & Diversion Strategy</h2>
            <div className="decisions-list">
              {decisions.map((dec) => (
                <DecisionExplanation key={dec.id} decision={dec} />
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Replanning;
