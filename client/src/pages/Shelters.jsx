import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import ShelterCard from "../components/ShelterCard";
import disasterService from "../services/disasterService";
import { Home, Search, Plus } from "lucide-react";

export function Shelters() {
  const [shelters, setShelters] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const loadShelters = async () => {
      const data = await disasterService.getShelters();
      setShelters(data);
    };
    loadShelters();
  }, []);

  const filteredShelters = shelters.filter(
    (s) => s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
           s.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalCapacity = shelters.reduce((acc, s) => acc + s.capacity, 0);
  const totalOccupied = shelters.reduce((acc, s) => acc + s.occupied, 0);

  return (
    <div className="app-layout">
      <Navbar />

      <main className="main-content">
        <div className="page-header">
          <div>
            <h1 className="page-title">Relief Shelters Directory</h1>
            <p className="page-subtitle">Monitor capacity, occupancy rates, and inventory stock across active shelters</p>
          </div>
        </div>

        <div className="shelter-summary-bar">
          <div className="summary-stat">
            <span className="summary-lbl">Active Shelters</span>
            <strong className="summary-val">{shelters.length}</strong>
          </div>
          <div className="summary-stat">
            <span className="summary-lbl">Total Capacity</span>
            <strong className="summary-val">{totalCapacity} people</strong>
          </div>
          <div className="summary-stat">
            <span className="summary-lbl">Current Occupancy</span>
            <strong className="summary-val">{totalOccupied} people</strong>
          </div>
          <div className="summary-stat">
            <span className="summary-lbl">Overall Fill Rate</span>
            <strong className="summary-val">
              {totalCapacity > 0 ? Math.round((totalOccupied / totalCapacity) * 100) : 0}%
            </strong>
          </div>
        </div>

        <div className="filter-bar">
          <div className="search-input-wrapper">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              placeholder="Search shelter name or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="shelters-grid">
          {filteredShelters.map((shelter) => (
            <ShelterCard key={shelter.id} shelter={shelter} />
          ))}
        </div>
      </main>
    </div>
  );
}

export default Shelters;
