import { BrowserRouter, Routes, Route } from "react-router-dom";
import LiquidChrome from "./components/LiquidChrome";

import RoleLanding from "./pages/RoleLanding";
import GeneralUser from "./pages/GeneralUser";
import OperatorLogin from "./pages/OperatorLogin";
import GovernmentLogin from "./pages/GovernmentLogin";
import GovernmentDashboard from "./pages/GovernmentDashboard";
import Dashboard from "./pages/Dashboard";
import Emergency from "./pages/Emergency";
import Resources from "./pages/Resources";
import Map from "./pages/Map";

function App() {
  return (
    <BrowserRouter>
      <div style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", zIndex: -1, pointerEvents: "none" }}>
        <LiquidChrome
          baseColor={[0.16470588235294117, 0.30196078431372547, 0.3568627450980392]}
          speed={1}
          amplitude={0.6}
          interactive={true}
        />
      </div>
      <Routes>
        {/* Main Role Selection Landing Page */}
        <Route path="/" element={<RoleLanding />} />

        {/* General User Routes */}
        <Route path="/user" element={<GeneralUser />} />
        <Route path="/user/report" element={<GeneralUser />} />

        {/* Operator Routes */}
        <Route path="/operator/login" element={<OperatorLogin />} />
        <Route path="/operator/dashboard" element={<Dashboard />} />

        {/* Government Routes */}
        <Route path="/government/login" element={<GovernmentLogin />} />
        <Route path="/government/dashboard" element={<GovernmentDashboard />} />

        {/* Legacy / Shared Sub-Routes */}
        <Route path="/emergency" element={<Emergency />} />
        <Route path="/resources" element={<Resources />} />
        <Route path="/map" element={<Map />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;