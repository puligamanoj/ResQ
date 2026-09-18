import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { 
  ShieldAlert, LayoutDashboard, AlertTriangle, Box, MapPin, 
  Layers, ArrowLeftRight, Navigation, Home, Users, Activity, Bell, LogOut, User 
} from "lucide-react";

export function Navbar() {
  const location = useLocation();
  const { user, logout } = useAuth();

  const isActive = (path) => location.pathname === path;

  const navItems = [
    { path: "/", label: "Dashboard", icon: LayoutDashboard },
    { path: "/disaster", label: "Disaster", icon: Layers },
    { path: "/emergency", label: "Emergency", icon: AlertTriangle },
    { path: "/resources", label: "Resources", icon: Box },
    { path: "/allocation", label: "Allocation", icon: ArrowLeftRight },
    { path: "/replanning", label: "Replanning", icon: Navigation },
    { path: "/map", label: "Live Map", icon: MapPin },
    { path: "/shelters", label: "Shelters", icon: Home },
    { path: "/missing-persons", label: "Missing Persons", icon: Users },
    { path: "/risk-analysis", label: "Risk Analysis", icon: Activity },
    { path: "/alerts", label: "Alerts", icon: Bell },
  ];

  return (
    <nav className="navbar-container">
      <div className="navbar-brand">
        <Link to="/" className="brand-logo">
          <ShieldAlert className="brand-icon" />
          <span>ResQ</span>
        </Link>
        <span className="brand-badge">Command HQ</span>
      </div>

      <div className="nav-scroll-wrapper">
        <div className="nav-links">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-link ${active ? "active" : ""}`}
              >
                <Icon size={16} className="nav-icon" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>

      <div className="navbar-user">
        {user ? (
          <div className="user-profile">
            <User size={16} className="user-icon" />
            <div className="user-info">
              <span className="user-name">{user.name || "Commander"}</span>
              <span className="user-role">{user.role || "Officer"}</span>
            </div>
            <button onClick={logout} className="logout-btn" title="Logout">
              <LogOut size={16} />
            </button>
          </div>
        ) : (
          <Link to="/login" className="login-link-btn">
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
