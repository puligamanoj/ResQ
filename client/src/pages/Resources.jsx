import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import ResourceCard from "../components/ResourceCard";
import resourceService from "../services/resourceService";
import { Truck, Search, Filter } from "lucide-react";

export function Resources() {
  const [resources, setResources] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("ALL");

  useEffect(() => {
    const fetchResources = async () => {
      const data = await resourceService.getResources();
      setResources(data);
    };
    fetchResources();
  }, []);

  const handleDeploy = async (resource) => {
    await resourceService.updateResourceStatus(resource.id, "Deployed");
    const updated = await resourceService.getResources();
    setResources(updated);
  };

  const filteredResources = resources.filter((r) => {
    const matchesSearch = r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          r.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === "ALL" || r.type === selectedType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="app-layout">
      <Navbar />

      <main className="main-content">
        <div className="page-header">
          <div>
            <h1 className="page-title">Relief & Rescue Resources</h1>
            <p className="page-subtitle">Track, filter, and dispatch available emergency response assets</p>
          </div>
        </div>

        <div className="filter-bar">
          <div className="search-input-wrapper">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              placeholder="Search resource name or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="filter-group">
            <Filter size={16} />
            <select value={selectedType} onChange={(e) => setSelectedType(e.target.value)}>
              <option value="ALL">All Categories</option>
              <option value="Rescue Team">Rescue Teams</option>
              <option value="Medical">Medical Units</option>
              <option value="Food Supply">Food Supplies</option>
              <option value="Water Supply">Water Tankers</option>
              <option value="Engineering">Engineering / Machinery</option>
            </select>
          </div>
        </div>

        <div className="resources-grid">
          {filteredResources.map((resource) => (
            <ResourceCard key={resource.id} resource={resource} onDeploy={handleDeploy} />
          ))}
        </div>
      </main>
    </div>
  );
}

export default Resources;