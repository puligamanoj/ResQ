import { Link } from "react-router-dom";
import "../index.css";

function Dashboard() {
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

        <div className="header">
          <div>
            <h1>Disaster Command Center</h1>
            <p>Real-time emergency response coordination</p>
          </div>

          <Link to="/emergency" className="primary-btn">
            + Report Emergency
          </Link>
        </div>

        <div className="stats">

          <div className="stat-card">
            <h3>Active Emergencies</h3>
            <h1>12</h1>
            <p>Currently active</p>
          </div>

          <div className="stat-card">
            <h3>Critical Cases</h3>
            <h1>4</h1>
            <p>Immediate response</p>
          </div>

          <div className="stat-card">
            <h3>Available Resources</h3>
            <h1>18</h1>
            <p>Ready for deployment</p>
          </div>

          <div className="stat-card">
            <h3>Active Teams</h3>
            <h1>7</h1>
            <p>Currently deployed</p>
          </div>

        </div>

        <div className="content-grid">

          <section className="panel">
            <div className="panel-header">
              <h2>Active Emergencies</h2>
              <span>Live</span>
            </div>

            <div className="emergency">
              <div>
                <h3>Flood — Area A</h3>
                <p>32 people affected</p>
              </div>
              <strong className="critical">CRITICAL</strong>
            </div>

            <div className="emergency">
              <div>
                <h3>Building Collapse — Area C</h3>
                <p>12 people affected</p>
              </div>
              <strong className="high">HIGH</strong>
            </div>

            <div className="emergency">
              <div>
                <h3>Food Shortage — Area B</h3>
                <p>80 people affected</p>
              </div>
              <strong className="medium">MEDIUM</strong>
            </div>

          </section>

          <section className="panel">

            <div className="panel-header">
              <h2>System Alerts</h2>
            </div>

            <div className="alert">
              🚨 <b>Road R17 blocked</b>
              <p>Emergency #104 requires replanning.</p>
            </div>

            <div className="alert">
              🚑 <b>Ambulance #03 assigned</b>
              <p>ETA: 8 minutes.</p>
            </div>

            <div className="alert">
              🔄 <b>Resources reallocated</b>
              <p>Alternative rescue team selected.</p>
            </div>

          </section>

        </div>

      </main>

    </div>
  );
}

export default Dashboard;