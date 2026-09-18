import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getResources, updateResource } from "../services/api";
import "../index.css";

function Resources() {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadResources = async () => {
    try {
      setError(null);
      const data = await getResources();
      setResources(data);
    } catch (err) {
      console.error("Failed to load resources:", err);
      setError("Could not load resources from backend");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadResources();
  }, []);

  const handleStatusChange = async (resourceId, newStatus) => {
    try {
      await updateResource(resourceId, { status: newStatus });
      await loadResources();
    } catch (err) {
      console.error("Status update error:", err);
      setError("Failed to update resource status");
    }
  };

  return (
    <div className="app">
      <nav className="navbar">
        <h2>🚨 ResQ</h2>
        <div className="nav-links">
          <Link to="/">Dashboard</Link>
          <Link to="/emergency">Emergency</Link>
          <Link to="/resources">Resources</Link>
          <Link to="/map">Live Map</Link>
        </div>
      </nav>

      <main className="dashboard">
        <h1>Rescue & Relief Resource Management</h1>
        <p>Monitor real-time availability, capacity, status, and manual status overrides for disaster response units.</p>

        {error && (
          <div className="alert" style={{ background: "#fee2e2", color: "#991b1b", marginTop: "15px" }}>
            ⚠️ {error}
          </div>
        )}

        {loading ? (
          <p style={{ marginTop: "20px" }}>Loading resources...</p>
        ) : (
          <div className="resource-grid">
            {resources.map((resource) => (
              <div className="resource-card" key={resource.id}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <h2>{resource.name}</h2>
                  <span className={`status-tag ${resource.status}`}>
                    {resource.status}
                  </span>
                </div>

                <p>
                  <b>Type:</b> {resource.type}
                </p>
                <p>
                  <b>Capacity & Speed:</b> {resource.capacity} seats • {resource.speed} km/h
                </p>
                <p>
                  <b>Capabilities:</b> {(resource.capabilities || []).join(", ") || "General Rescue"}
                </p>
                <p>
                  <b>Location Coords:</b> {resource.latitude}, {resource.longitude}
                </p>

                <div style={{ marginTop: "15px", paddingTop: "12px", borderTop: "1px dashed #e5e7eb" }}>
                  <label style={{ fontSize: "12px", fontWeight: "bold", display: "block", marginBottom: "4px" }}>Change Status Override:</label>
                  <select
                    style={{ padding: "6px 10px", borderRadius: "5px", border: "1px solid #d1d5db", fontSize: "13px", width: "100%" }}
                    value={resource.status}
                    onChange={(e) => handleStatusChange(resource.id, e.target.value)}
                  >
                    <option value="Available">Available (Ready)</option>
                    <option value="Assigned">Assigned (Assigned Mission)</option>
                    <option value="Travelling">Travelling (En Route)</option>
                    <option value="Busy">Busy (On Scene)</option>
                    <option value="Completed">Completed (Mission Done)</option>
                    <option value="Unavailable">Unavailable (Breakdown / Maintenance)</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default Resources;