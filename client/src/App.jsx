import React from "react";
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import LiquidChrome from "./components/LiquidChrome";
import Dashboard from "./pages/Dashboard";
import Disaster from "./pages/Disaster";
import Emergency from "./pages/Emergency";
import Resources from "./pages/Resources";
import Allocation from "./pages/Allocation";
import Replanning from "./pages/Replanning";
import Map from "./pages/Map";
import Shelters from "./pages/Shelters";
import MissingPersons from "./pages/MissingPersons";
import RiskAnalysis from "./pages/RiskAnalysis";
import Alerts from "./pages/Alerts";
import Login from "./pages/Login";

export function App() {
  return (
    <AuthProvider>
      {/* Global animated LiquidChrome background */}
      <div 
        style={{ 
          position: "fixed", 
          top: 0, 
          left: 0, 
          width: "100vw", 
          height: "100vh", 
          zIndex: 0, 
          pointerEvents: "none",
          overflow: "hidden" 
        }}
      >
        <LiquidChrome
          baseColor={[0.023529411764705882, 0.23529411764705882, 0.27450980392156865]}
          speed={1}
          amplitude={0.6}
          interactive={true}
        />
      </div>

      {/* Main app content container positioned above the canvas */}
      <div style={{ position: "relative", zIndex: 1 }}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/disaster" element={<Disaster />} />
          <Route path="/emergency" element={<Emergency />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/allocation" element={<Allocation />} />
          <Route path="/replanning" element={<Replanning />} />
          <Route path="/map" element={<Map />} />
          <Route path="/shelters" element={<Shelters />} />
          <Route path="/missing-persons" element={<MissingPersons />} />
          <Route path="/risk-analysis" element={<RiskAnalysis />} />
          <Route path="/alerts" element={<Alerts />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </div>
    </AuthProvider>
  );
}

export default App;
