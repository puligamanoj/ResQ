import { Link } from "react-router-dom";
import "../index.css";

function Resources() {

  const resources = [
    {
      name: "Rescue Team Alpha",
      type: "Rescue Team",
      location: "Area A",
      status: "Available"
    },
    {
      name: "Ambulance #03",
      type: "Medical",
      location: "Area C",
      status: "Available"
    },
    {
      name: "Food Vehicle #07",
      type: "Food Supply",
      location: "Area B",
      status: "Deployed"
    },
    {
      name: "Rescue Team Beta",
      type: "Rescue Team",
      location: "Area D",
      status: "Available"
    }
  ];

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

        <h1>Resources</h1>
        <p>Monitor rescue and relief resources.</p>

        <div className="resource-grid">

          {resources.map((resource, index) => (

            <div className="resource-card" key={index}>

              <h2>{resource.name}</h2>

              <p>
                <b>Type:</b> {resource.type}
              </p>

              <p>
                <b>Location:</b> {resource.location}
              </p>

              <p>
                <b>Status:</b>{" "}
                <span className={
                  resource.status === "Available"
                    ? "available"
                    : "deployed"
                }>
                  {resource.status}
                </span>
              </p>

            </div>

          ))}

        </div>

      </main>

    </div>
  );
}

export default Resources;