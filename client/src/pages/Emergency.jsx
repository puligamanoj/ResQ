import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import EmergencyCard from "../components/EmergencyCard";
import emergencyService from "../services/emergencyService";
import { AlertTriangle, Send, CheckCircle } from "lucide-react";

export function Emergency() {
  const [emergencies, setEmergencies] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    type: "Flood",
    affectedPeople: "",
    vulnerablePeople: "",
    urgency: "HIGH",
    description: ""
  });

  useEffect(() => {
    const loadEmergencies = async () => {
      const data = await emergencyService.getEmergencies();
      setEmergencies(data);
    };
    loadEmergencies();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newEmergency = {
      title: `${formData.type} — ${formData.location || "Area Sector"}`,
      location: formData.location || "Unspecified Sector",
      affectedPeople: parseInt(formData.affectedPeople) || 1,
      vulnerablePeople: parseInt(formData.vulnerablePeople) || 0,
      urgency: formData.urgency,
      type: formData.type,
      description: formData.description
    };

    await emergencyService.reportEmergency(newEmergency);
    const updatedList = await emergencyService.getEmergencies();
    setEmergencies(updatedList);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
    setFormData({
      name: "",
      location: "",
      type: "Flood",
      affectedPeople: "",
      vulnerablePeople: "",
      urgency: "HIGH",
      description: ""
    });
  };

  return (
    <div className="app-layout">
      <Navbar />

      <main className="main-content">
        <div className="page-header">
          <div>
            <h1 className="page-title">Emergency Dispatch & Incident Reporting</h1>
            <p className="page-subtitle">Submit critical emergency incidents and monitor active reports</p>
          </div>
        </div>

        <div className="two-column-layout">
          <div className="form-card">
            <h2><AlertTriangle size={20} className="text-danger" /> Report New Emergency</h2>
            <p className="form-desc">Provide detailed information for rapid response dispatch.</p>

            {submitted && (
              <div className="alert-banner alert-success">
                <CheckCircle size={18} /> Incident reported successfully! Dispatch team notified.
              </div>
            )}

            <form onSubmit={handleSubmit} className="standard-form">
              <div className="form-group">
                <label>Reporter Name / Unit</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter reporter name or unit ID"
                  required
                />
              </div>

              <div className="form-group">
                <label>Location / Sector</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="e.g. Area A, North Bridge Rd"
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Emergency Type</label>
                  <select name="type" value={formData.type} onChange={handleChange}>
                    <option value="Flood">Flood</option>
                    <option value="Building Collapse">Building Collapse</option>
                    <option value="Fire">Fire</option>
                    <option value="Medical Emergency">Medical Emergency</option>
                    <option value="Food Shortage">Food Shortage</option>
                    <option value="Storm Damage">Storm Damage</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Urgency Level</label>
                  <select name="urgency" value={formData.urgency} onChange={handleChange}>
                    <option value="CRITICAL">CRITICAL</option>
                    <option value="HIGH">HIGH</option>
                    <option value="MEDIUM">MEDIUM</option>
                    <option value="LOW">LOW</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>People Affected</label>
                  <input
                    type="number"
                    name="affectedPeople"
                    value={formData.affectedPeople}
                    onChange={handleChange}
                    placeholder="Total count"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Vulnerable (Elderly/Children)</label>
                  <input
                    type="number"
                    name="vulnerablePeople"
                    value={formData.vulnerablePeople}
                    onChange={handleChange}
                    placeholder="Vulnerable count"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Description & Immediate Needs</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Provide precise details, hazards, and requested help..."
                  rows="4"
                />
              </div>

              <button type="submit" className="btn-primary btn-full">
                <Send size={16} /> Submit Emergency Report
              </button>
            </form>
          </div>

          <div className="list-column">
            <h2>Active Incidents Registry ({emergencies.length})</h2>
            <div className="emergency-cards-list">
              {emergencies.map((emg) => (
                <EmergencyCard key={emg.id} emergency={emg} />
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Emergency;