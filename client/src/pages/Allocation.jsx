import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import AllocationCard from "../components/AllocationCard";
import DecisionExplanation from "../components/DecisionExplanation";
import disasterService from "../services/disasterService";
import { ArrowLeftRight, CheckCircle, Cpu } from "lucide-react";

export function Allocation() {
  const [allocations, setAllocations] = useState([]);
  const [decisions, setDecisions] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const alcData = await disasterService.getAllocations();
      const decData = await disasterService.getReplanningDecisions();
      setAllocations(alcData);
      setDecisions(decData);
    };
    fetchData();
  }, []);

  return (
    <div className="app-layout">
      <Navbar />

      <main className="main-content">
        <div className="page-header">
          <div>
            <h1 className="page-title">Resource Allocation Engine</h1>
            <p className="page-subtitle">Manage resource-to-emergency dispatches and automated optimization</p>
          </div>
        </div>

        <div className="two-column-layout">
          <div className="list-column">
            <h2>Active Resource Allocations</h2>
            <div className="allocations-list">
              {allocations.map((alc) => (
                <AllocationCard key={alc.id} allocation={alc} />
              ))}
            </div>
          </div>

          <div className="list-column">
            <h2>AI Optimization & Dispatch Rationale</h2>
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

export default Allocation;
