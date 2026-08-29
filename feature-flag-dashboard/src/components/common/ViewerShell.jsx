import React, { useState } from "react";
import { useAuth } from "../../AuthContext";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FiGrid, FiFlag, FiFileText, FiSettings, FiLogOut, FiChevronDown, FiEye, FiMenu, FiX } from "react-icons/fi";
import RoleBadge from "./RoleBadge";
import { getPageTitle } from "./pageMeta";
import "./ViewerShell.css";

const VIEWER_MENU = [
  { name: "Overview", icon: FiGrid, path: "/" },
  { name: "Features", icon: FiFlag, path: "/features" },
  { name: "Audit Logs", icon: FiFileText, path: "/audit" },
  { name: "Settings", icon: FiSettings, path: "/settings" },
];

export default function ViewerShell({ children }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const title = getPageTitle(location.pathname);
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const goto = (path) => {
    navigate(path);
    setMobileNavOpen(false);
  };

  const avatarChar = user?.email ? user.email.charAt(0).toUpperCase() : "U";

  return (
    <div className="ffc-viewer-shell" data-role="viewer">
      <header className="ffc-viewer-topbar">
        <div className="ffc-viewer-topbar-inner">
          <div className="ffc-viewer-brand">
            <span className="ffc-viewer-brand-icon">
              <FiEye />
            </span>
            <span>FF Console</span>
            <span className="ffc-viewer-brand-tag">viewer</span>
          </div>

          <nav className="ffc-viewer-pill-nav">
            {VIEWER_MENU.map((item) => {
              const Icon = item.icon;
              const active = location.pathname === item.path;
              return (
                <button
                  key={item.path}
                  className={`ffc-viewer-pill ${active ? "active" : ""}`}
                  onClick={() => goto(item.path)}
                >
                  <Icon />
                  {item.name}
                </button>
              );
            })}
          </nav>

          <div className="ffc-viewer-right">
            <button
              className="ffc-viewer-mobile-toggle"
              onClick={() => setMobileNavOpen((v) => !v)}
              aria-label="Toggle navigation"
            >
              {mobileNavOpen ? <FiX /> : <FiMenu />}
            </button>

            <div className="ffc-user-profile-menu">
              <button className={`ffc-viewer-profile-btn ${menuOpen ? "active" : ""}`} onClick={() => setMenuOpen((v) => !v)}>
                <div className="ffc-viewer-avatar">{avatarChar}</div>
                <FiChevronDown className="ffc-chevron" />
              </button>

              <AnimatePresence>
                {menuOpen && (
                  <>
                    <div className="ffc-dropdown-backdrop" onClick={() => setMenuOpen(false)} />
                    <motion.div
                      className="ffc-viewer-dropdown"
                      initial={{ opacity: 0, y: -6, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -6, scale: 0.98 }}
                      transition={{ duration: 0.15 }}
                    >
                      <div className="ffc-dropdown-header">
                        <span>{user.email}</span>
                        <RoleBadge role={user.role} />
                      </div>
                      <div className="ffc-dropdown-divider" />
                      <button
                        onClick={() => {
                          setMenuOpen(false);
                          navigate("/settings");
                        }}
                        className="ffc-dropdown-item"
                      >
                        <FiSettings /> Settings
                      </button>
                      <button
                        onClick={() => {
                          setMenuOpen(false);
                          handleLogout();
                        }}
                        className="ffc-dropdown-item logout"
                      >
                        <FiLogOut /> Log out
                      </button>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {mobileNavOpen && (
          <div className="ffc-viewer-mobile-nav">
            {VIEWER_MENU.map((item) => {
              const Icon = item.icon;
              const active = location.pathname === item.path;
              return (
                <button
                  key={item.path}
                  className={`ffc-viewer-pill ${active ? "active" : ""}`}
                  onClick={() => goto(item.path)}
                >
                  <Icon />
                  {item.name}
                </button>
              );
            })}
          </div>
        )}
      </header>

      <main className="ffc-viewer-content">
        <div className="ffc-viewer-content-inner">
          <h1 className="ffc-viewer-page-title">{title}</h1>
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            {children}
          </motion.div>
        </div>
      </main>
    </div>
  );
}
