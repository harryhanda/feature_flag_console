import React from "react";
import { useAuth } from "../AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { FiGrid, FiFlag, FiUsers, FiFileText, FiLayers, FiSettings, FiLogOut, FiShield } from "react-icons/fi";
import RoleBadge from "./common/RoleBadge";
import "./Sidebar.css";

const ADMIN_MENU = [
  { name: "Dashboard", icon: <FiGrid />, path: "/" },
  { name: "Feature Flags", icon: <FiFlag />, path: "/features" },
  { name: "Users", icon: <FiUsers />, path: "/users" },
  { name: "Audit Logs", icon: <FiFileText />, path: "/audit" },
  { name: "Environments", icon: <FiLayers />, path: "/environments" },
  { name: "Settings", icon: <FiSettings />, path: "/settings" },
];

// The admin command sidebar. This component is only ever rendered inside
// AdminShell now — Developer and Viewer roles get their own nav chrome
// (DeveloperShell / ViewerShell) so the three consoles never share layout.
export default function Sidebar({ closeMobile }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigate = (path) => {
    navigate(path);
    if (closeMobile) closeMobile();
  };

  const handleLogout = () => {
    logout();
    handleNavigate("/login");
  };

  if (!user) return null;

  const emailName = user.email ? user.email.split("@")[0] : "User";

  return (
    <div className="ffc-sidebar">
      <div className="ffc-sidebar-brand" onClick={() => handleNavigate("/")}>
        <span className="ffc-sidebar-logo-emoji">
          <FiShield />
        </span>
        <span className="ffc-sidebar-logo-text">FF Console</span>
      </div>

      <span className="ffc-sidebar-eyebrow">Command Deck</span>

      <nav className="ffc-sidebar-menu">
        {ADMIN_MENU.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.name}
              className={`ffc-sidebar-item ${isActive ? "active" : ""}`}
              onClick={() => handleNavigate(item.path)}
            >
              <span className="ffc-sidebar-item-icon">{item.icon}</span>
              <span className="ffc-sidebar-item-text">{item.name}</span>
              {isActive && <span className="ffc-sidebar-item-glow" aria-hidden="true" />}
            </button>
          );
        })}
      </nav>

      <div className="ffc-sidebar-footer">
        <div className="ffc-sidebar-user-card">
          <div className="ffc-sidebar-user-avatar">
            {user.email ? user.email.charAt(0).toUpperCase() : "U"}
          </div>
          <div className="ffc-sidebar-user-details">
            <span className="ffc-sidebar-user-name">{emailName}</span>
            <RoleBadge role={user.role} />
          </div>
        </div>

        <button className="ffc-sidebar-logout-btn" onClick={handleLogout}>
          <FiLogOut />
          <span>Log Out</span>
        </button>
      </div>
    </div>
  );
}
