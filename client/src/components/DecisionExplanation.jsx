import React from "react";
import { Cpu, Check, AlertOctagon, HelpCircle } from "lucide-react";

export function DecisionExplanation({ decision }) {
  if (!decision) return null;

  return (
    <div className="decision-explanation-card">
      <div className="decision-header">
        <div className="decision-title-group">
          <Cpu className="ai-icon" size={20} />
          <div>
            <h3>AI Dispatch Optimization</h3>
            <span className="decision-sub">Trigger: {decision.triggerEvent}</span>
          </div>
        </div>
        <div className="confidence-pill">
          Confidence: <b>{decision.confidenceScore}</b>
        </div>
      </div>

      <div className="decision-body">
        <div className="decision-field">
          <label>Target Dispatch:</label>
          <span>{decision.affectedDispatch}</span>
        </div>

        <div className="decision-field highlight-rec">
          <label>Recommendation:</label>
          <span>{decision.aiRecommendation}</span>
        </div>

        <div className="decision-field">
          <label>Decision Rationale & Factors:</label>
          <p>{decision.reasoning}</p>
        </div>
      </div>
    </div>
  );
}

export default DecisionExplanation;
