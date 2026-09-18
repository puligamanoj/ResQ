import React, { useState } from "react";
import Navbar from "../components/Navbar";
import { Users, Search, Plus, UserCheck, Clock, MapPin, CheckCircle } from "lucide-react";

export function MissingPersons() {
  const [persons, setPersons] = useState([
    {
      id: "MP-101",
      name: "Arthur Pendelton",
      age: 68,
      lastSeenLocation: "Area A Sector 2 Flood Zone",
      status: "Searching",
      reportedBy: "Family",
      contactPhone: "+1 555-9011",
      photo: null,
      details: "Wearing blue rain jacket and glasses. Last seen near riverside apartment complex."
    },
    {
      id: "MP-102",
      name: "Sophia Martinez",
      age: 14,
      lastSeenLocation: "Commercial Complex Area C",
      status: "Located & Safe",
      reportedBy: "St. Jude Shelter Staff",
      contactPhone: "+1 555-9022",
      photo: null,
      details: "Safely evacuated to St. Jude shelter. Reunited with guardian."
    },
    {
      id: "MP-103",
      name: "Marcus Vance",
      age: 42,
      lastSeenLocation: "Industrial Park Gate 4",
      status: "Searching",
      reportedBy: "Coworker",
      contactPhone: "+1 555-9033",
      photo: null,
      details: "Drives red pickup truck. Was at warehouse facility during electrical fire."
    }
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [newPerson, setNewPerson] = useState({
    name: "",
    age: "",
    lastSeenLocation: "",
    contactPhone: "",
    details: ""
  });

  const handleAddPerson = (e) => {
    e.preventDefault();
    const created = {
      id: `MP-${Math.floor(100 + Math.random() * 900)}`,
      name: newPerson.name,
      age: parseInt(newPerson.age) || 0,
      lastSeenLocation: newPerson.lastSeenLocation,
      status: "Searching",
      reportedBy: "Civilian Report",
      contactPhone: newPerson.contactPhone,
      details: newPerson.details
    };
    setPersons([created, ...persons]);
    setShowModal(false);
    setNewPerson({ name: "", age: "", lastSeenLocation: "", contactPhone: "", details: "" });
  };

  const filteredPersons = persons.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.lastSeenLocation.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="app-layout">
      <Navbar />

      <main className="main-content">
        <div className="page-header">
          <div>
            <h1 className="page-title">Missing Persons Registry</h1>
            <p className="page-subtitle">Central registry for reporting, tracking, and reuniting missing individuals</p>
          </div>

          <button onClick={() => setShowModal(true)} className="btn-primary">
            <Plus size={16} /> Report Missing Person
          </button>
        </div>

        <div className="filter-bar">
          <div className="search-input-wrapper">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              placeholder="Search person's name or last seen location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="missing-persons-grid">
          {filteredPersons.map((person) => (
            <div key={person.id} className="person-card">
              <div className="person-card-header">
                <div className="person-avatar">
                  <Users size={24} />
                </div>
                <div>
                  <h3>{person.name} ({person.age} yrs)</h3>
                  <span className="person-id">{person.id}</span>
                </div>
                <span className={`status-pill ${person.status === "Searching" ? "status-critical" : "status-success"}`}>
                  {person.status}
                </span>
              </div>

              <div className="person-card-body">
                <p><MapPin size={14} /> <b>Last Seen:</b> {person.lastSeenLocation}</p>
                <p><Clock size={14} /> <b>Reported By:</b> {person.reportedBy}</p>
                <p><b>Contact Phone:</b> {person.contactPhone}</p>
                {person.details && <p className="person-desc">{person.details}</p>}
              </div>
            </div>
          ))}
        </div>

        {showModal && (
          <div className="modal-overlay">
            <div className="modal-card">
              <h2>Report Missing Person</h2>
              <form onSubmit={handleAddPerson} className="standard-form mt-3">
                <div className="form-group">
                  <label>Full Name</label>
                  <input
                    type="text"
                    required
                    value={newPerson.name}
                    onChange={(e) => setNewPerson({ ...newPerson, name: e.target.value })}
                  />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Age</label>
                    <input
                      type="number"
                      required
                      value={newPerson.age}
                      onChange={(e) => setNewPerson({ ...newPerson, age: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Contact Phone</label>
                    <input
                      type="text"
                      required
                      value={newPerson.contactPhone}
                      onChange={(e) => setNewPerson({ ...newPerson, contactPhone: e.target.value })}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>Last Seen Location</label>
                  <input
                    type="text"
                    required
                    value={newPerson.lastSeenLocation}
                    onChange={(e) => setNewPerson({ ...newPerson, lastSeenLocation: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Additional Details / Clothing / Distinguishing Features</label>
                  <textarea
                    rows="3"
                    value={newPerson.details}
                    onChange={(e) => setNewPerson({ ...newPerson, details: e.target.value })}
                  />
                </div>
                <div className="modal-actions">
                  <button type="button" onClick={() => setShowModal(false)} className="btn-secondary">
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary">
                    Submit Report
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default MissingPersons;
