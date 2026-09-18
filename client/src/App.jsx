import { BrowserRouter, Routes, Route } from "react-router-dom";
import LiquidChrome from "./components/LiquidChrome";

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
        <Route path="/" element={<Dashboard />} />
        <Route path="/emergency" element={<Emergency />} />
        <Route path="/resources" element={<Resources />} />
        <Route path="/map" element={<Map />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;