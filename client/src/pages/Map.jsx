import React, { useState } from "react";
import Navbar from "../components/Navbar";
import { MapPin, AlertTriangle, Truck, Home, Navigation, Layers } from "lucide-react";

export function Map() {
  const [activeLayer, setActiveLayer] = useState("all");

  const mapMarkers = [
    { id: 1, type: "emergency", title: "Flood — Area A", lat: 35, lng: 40, priority: "CRITICAL" },
    { id: 2, type: "emergency", title: "Collapse — Area C", lat: 60, lng: 70, priority: "CRITICAL" },
    { id: 3, type: "resource", title: "Rescue Team Alpha", lat: 38, lng: 45, status: "In Transit" },
    { id: 4, type: "resource", title: "Ambulance #03", lat: 65, lng: 68, status: "Deployed" },
    { id: 5, type: "road", title: "Road R17 Blocked", lat: 50, lng: 30, status: "Blocked" },
    { id: 6, type: "shelter", title: "St. Jude Shelter", lat: 25, lng: 60, status: "Open" }
  ];

  const filteredMarkers = mapMarkers.filter(
    (m) => activeLayer === "all" || m.type === activeLayer
  );

  return (
    <div className="app-layout">
      <Navbar />

      <main className="main-content">
        <div className="page-header">
          <div>
            <h1 className="page-title">Live Disaster Map</h1>
            <p className="page-subtitle">Geospatial tracking of active emergencies, response assets, and road hazards</p>
          </div>

          <div className="layer-controls">
            <button
              onClick={() => setActiveLayer("all")}
              className={`btn-toggle ${activeLayer === "all" ? "active" : ""}`}
            >
              <Layers size={14} /> All Layers
            </button>
            <button
              onClick={() => setActiveLayer("emergency")}
              className={`btn-toggle ${activeLayer === "emergency" ? "active" : ""}`}
            >
              <AlertTriangle size={14} /> Emergencies
            </button>
            <button
              onClick={() => setActiveLayer("resource")}
              className={`btn-toggle ${activeLayer === "resource" ? "active" : ""}`}
            >
              <Truck size={14} /> Units
            </button>
            <button
              onClick={() => setActiveLayer("road")}
              className={`btn-toggle ${activeLayer === "road" ? "active" : ""}`}
            >
              <Navigation size={14} /> Blocked Roads
            </button>
          </div>
        </div>

        <div className="interactive-map-container">
          <div className="map-canvas-mock">
            <div className="grid-overlay"></div>

            {filteredMarkers.map((marker) => (
              <div
                key={marker.id}
                className={`map-pin-item pin-${marker.type}`}
                style={{ top: `${marker.lat}%`, left: `${marker.lng}%` }}
              >
                <div className="pin-tooltip">
                  <strong>{marker.title}</strong>
                  <span>{marker.priority || marker.status}</span>
                </div>
                {marker.type === "emergency" && <AlertTriangle size={18} />}
                {marker.type === "resource" && <Truck size={18} />}
                {marker.type === "road" && <Navigation size={18} />}
                {marker.type === "shelter" && <Home size={18} />}
              </div>
            ))}

            <div className="map-legend">
              <h4>Map Legend</h4>
              <div className="legend-item"><span className="legend-dot dot-emergency"></span> Emergency Incident</div>
              <div className="legend-item"><span className="legend-dot dot-resource"></span> Deployed Unit</div>
              <div className="legend-item"><span className="legend-dot dot-road"></span> Blocked Route</div>
              <div className="legend-item"><span className="legend-dot dot-shelter"></span> Relief Shelter</div>
            </div>

            <div className="map-live-overlay">
              <span className="pulse-indicator"></span> LIVE GEOSPATIAL DATA STREAM
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Map;