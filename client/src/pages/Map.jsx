import { Link } from "react-router-dom";
import "../index.css";

function Map() {
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

        <h1>Live Disaster Map</h1>
        <p>
          Monitor emergencies, resources and blocked routes.
        </p>

        <div className="map-placeholder">

          <div className="map-marker emergency-marker">
            🔴 Emergency
          </div>

          <div className="map-marker resource-marker">
            🟢 Rescue Team
          </div>

          <div className="map-marker road-marker">
            ⚫ Road R17 Blocked
          </div>

          <h2>LIVE MAP</h2>
          <p>Map integration coming next</p>

        </div>

      </main>

    </div>
  );
}

export default Map;