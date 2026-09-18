import { Link } from "react-router-dom";
import "../index.css";

function Emergency() {
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

      <main className="form-container">

        <h1>Report Emergency</h1>
        <p>Provide details about the emergency situation.</p>

        <form className="emergency-form">

          <label>Name</label>
          <input
            type="text"
            placeholder="Enter your name"
          />

          <label>Location</label>
          <input
            type="text"
            placeholder="Enter location"
          />

          <label>Emergency Type</label>
          <select>
            <option>Flood</option>
            <option>Building Collapse</option>
            <option>Fire</option>
            <option>Medical Emergency</option>
            <option>Food Shortage</option>
          </select>

          <label>People Affected</label>
          <input
            type="number"
            placeholder="Number of people"
          />

          <label>Vulnerable People</label>
          <input
            type="number"
            placeholder="Children / elderly / disabled"
          />

          <label>Urgency</label>
          <select>
            <option>CRITICAL</option>
            <option>HIGH</option>
            <option>MEDIUM</option>
            <option>LOW</option>
          </select>

          <label>Description</label>
          <textarea
            placeholder="Describe the situation..."
            rows="5"
          />

          <button className="primary-btn">
            🚨 Submit Emergency
          </button>

        </form>

      </main>

    </div>
  );
}

export default Emergency;