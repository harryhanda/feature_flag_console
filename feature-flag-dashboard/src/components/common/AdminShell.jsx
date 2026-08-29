import React, { useState } from "react";
import { useAuth } from "../../AuthContext";
import { useLocation, useNavigate } from "react-router-dom";
import { FiMenu, FiX, FiChevronDown, FiLogOut, FiSettings, FiShield } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import Sidebar from "../Sidebar";
import RoleBadge from "./RoleBadge";
import { getPageTitle } from "./pageMeta";
import "./AdminShell.css";

export default function AdminShell({ children }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  const title = getPageTitle(location.pathname);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const avatarChar = user?.email ? user.email.charAt(0).toUpperCase() : "U";

  return (
    <div className="ffc-admin-shell" data-role="admin">
      {/* Mobile header */}
      <header className="ffc-admin-mobile-header">
        <button className="ffc-menu-toggle" onClick={() => setMobileOpen(true)} aria-label="Open Sidebar">
          <FiMenu />
        </button>
        <span className="ffc-admin-mobile-brand">
          <FiShield /> FF Console
        </span>
        <div className="ffc-admin-mobile-avatar" onClick={() => navigate("/settings")}>
          {avatarChar}
        </div>
      </header>

      {mobileOpen && <div className="ffc-sidebar-overlay" onClick={() => setMobileOpen(false)} />}

      <div className={`ffc-admin-sidebar-container ${mobileOpen ? "open" : ""}`}>
        <button className="ffc-sidebar-close" onClick={() => setMobileOpen(false)} aria-label="Close Sidebar">
          <FiX />
        </button>
        <Sidebar closeMobile={() => setMobileOpen(false)} />
      </div>

      <div className="ffc-admin-main">
        <header className="ffc-admin-navbar">
          <div className="ffc-admin-navbar-left">
            <span className="ffc-admin-eyebrow">Admin Console</span>
            <h1 className="ffc-admin-page-title">{title}</h1>
          </div>

          <div className="ffc-admin-navbar-right">
            <div className="ffc-user-profile-menu">
              <button
                className={`ffc-admin-profile-btn ${profileMenuOpen ? "active" : ""}`}
                onClick={() => setProfileMenuOpen((v) => !v)}
              >
                <div className="ffc-admin-avatar">{avatarChar}</div>
                <div className="ffc-admin-profile-text">
                  <span className="ffc-admin-profile-email">{user.email}</span>
                  <RoleBadge role={user.role} />
                </div>
                <FiChevronDown className="ffc-chevron" />
              </button>

              <AnimatePresence>
                {profileMenuOpen && (
                  <>
                    <div className="ffc-dropdown-backdrop" onClick={() => setProfileMenuOpen(false)} />
                    <motion.div
                      className="ffc-admin-dropdown"
                      initial={{ opacity: 0, y: -6, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -6, scale: 0.98 }}
                      transition={{ duration: 0.15 }}
                    >
                      <div className="ffc-dropdown-header">
                        <strong>Signed in as</strong>
                        <span>{user.email}</span>
                      </div>
                      <div className="ffc-dropdown-divider" />
                      <button
                        onClick={() => {
                          setProfileMenuOpen(false);
                          navigate("/settings");
                        }}
                        className="ffc-dropdown-item"
                      >
                        <FiSettings /> Settings
                      </button>
                      <button
                        onClick={() => {
                          setProfileMenuOpen(false);
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
        </header>

        <main className="ffc-admin-content">
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
