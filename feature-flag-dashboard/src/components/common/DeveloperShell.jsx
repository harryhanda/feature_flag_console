import React, { useState } from "react";
import { useAuth } from "../../AuthContext";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiGrid,
  FiFlag,
  FiLayers,
  FiFileText,
  FiSettings,
  FiLogOut,
  FiMenu,
  FiX,
  FiTerminal,
} from "react-icons/fi";
import { getPageTitle } from "./pageMeta";
import "./DeveloperShell.css";

const DEV_MENU = [
  { name: "Dashboard", file: "dashboard.tsx", icon: FiGrid, path: "/" },
  { name: "Feature Flags", file: "flags.tsx", icon: FiFlag, path: "/features" },
  { name: "Environments", file: "environments.tsx", icon: FiLayers, path: "/environments" },
  { name: "Audit Logs", file: "audit.log", icon: FiFileText, path: "/audit" },
  { name: "Settings", file: "settings.json", icon: FiSettings, path: "/settings" },
];

export default function DeveloperShell({ children }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [railOpen, setRailOpen] = useState(false);

  const title = getPageTitle(location.pathname);
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const goto = (path) => {
    navigate(path);
    setRailOpen(false);
  };

  const username = user?.email ? user.email.split("@")[0] : "dev";

  return (
    <div className="ffc-dev-shell" data-role="developer">
      {/* Icon rail */}
      {railOpen && <div className="ffc-sidebar-overlay" onClick={() => setRailOpen(false)} />}
      <nav className={`ffc-dev-rail ${railOpen ? "open" : ""}`} aria-label="Primary">
        <button className="ffc-dev-rail-close" onClick={() => setRailOpen(false)} aria-label="Close menu">
          <FiX />
        </button>
        <div className="ffc-dev-rail-mark">
          <FiTerminal />
        </div>
        {DEV_MENU.map((item) => {
          const Icon = item.icon;
          const active = location.pathname === item.path;
          return (
            <button
              key={item.path}
              className={`ffc-dev-rail-btn ${active ? "active" : ""}`}
              onClick={() => goto(item.path)}
              title={item.name}
            >
              <Icon />
              <span className="ffc-dev-rail-tooltip">{item.name}</span>
            </button>
          );
        })}
        <button className="ffc-dev-rail-btn logout" onClick={handleLogout} title="Log out">
          <FiLogOut />
          <span className="ffc-dev-rail-tooltip">Log out</span>
        </button>
      </nav>

      <div className="ffc-dev-main">
        {/* Editor-style tab bar */}
        <header className="ffc-dev-topbar">
          <button className="ffc-dev-menu-toggle" onClick={() => setRailOpen(true)} aria-label="Open menu">
            <FiMenu />
          </button>
          <div className="ffc-dev-tabs">
            {DEV_MENU.map((item) => {
              const active = location.pathname === item.path;
              return (
                <button
                  key={item.path}
                  className={`ffc-dev-tab ${active ? "active" : ""}`}
                  onClick={() => goto(item.path)}
                >
                  <span className="ffc-dev-tab-dot" />
                  {item.file}
                </button>
              );
            })}
          </div>
          <div className="ffc-dev-user-chip">
            <span className="ffc-dev-user-avatar">{username.charAt(0).toUpperCase()}</span>
            <span className="ffc-dev-user-name">{username}</span>
          </div>
        </header>

        {/* Terminal prompt strip */}
        <div className="ffc-dev-prompt">
          <span className="ffc-dev-prompt-user">{username}@ff-console</span>
          <span className="ffc-dev-prompt-sep">:</span>
          <span className="ffc-dev-prompt-path">~/{title.toLowerCase().replace(/\s+/g, "-")}</span>
          <span className="ffc-dev-prompt-caret">$</span>
          <span className="ffc-dev-prompt-cursor" />
        </div>

        <main className="ffc-dev-content">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
