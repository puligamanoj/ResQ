import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ShieldAlert, Lock, User, LogIn } from "lucide-react";

export function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Commander");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login({ email, password, role });
    navigate("/");
  };

  return (
    <div className="login-screen-container">
      <div className="login-card">
        <div className="login-header">
          <ShieldAlert className="login-brand-icon" size={36} />
          <h1>ResQ Command Center</h1>
          <p>Disaster Response Portal Access</p>
        </div>

        <form onSubmit={handleSubmit} className="standard-form">
          <div className="form-group">
            <label>Select User Role</label>
            <select value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="Commander">Disaster Commander</option>
              <option value="Dispatcher">Resource Dispatcher</option>
              <option value="Responder">Field Rescue Responder</option>
              <option value="Citizen">Civilian / Citizen</option>
            </select>
          </div>

          <div className="form-group">
            <label>Email Address / User ID</label>
            <div className="input-with-icon">
              <User size={18} className="input-icon" />
              <input
                type="email"
                required
                placeholder="commander@resq.gov"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Security Password</label>
            <div className="input-with-icon">
              <Lock size={18} className="input-icon" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button type="submit" className="btn-primary btn-full mt-2">
            <LogIn size={18} /> Sign In to Command Portal
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
