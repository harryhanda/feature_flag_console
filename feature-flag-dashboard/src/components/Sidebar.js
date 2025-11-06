import React from "react";
import { FaFlag, FaUsers, FaHistory, FaCog, FaMoon, FaSun } from "react-icons/fa";
import "./Sidebar.css";

export default function Sidebar({ activeTab, setActiveTab, darkMode, setDarkMode }) {
  const menu = [
    { name: "Features", icon: <FaFlag /> },
    { name: "Users", icon: <FaUsers /> },
    { name: "Audit Log", icon: <FaHistory /> },
    { name: "Settings", icon: <FaCog /> },
  ];

  return (
    <div className={`sidebar ${darkMode ? "dark" : ""}`}>
      <h2 className="logo">🚀 FF Console</h2>
      {menu.map((item) => (
        <div
          key={item.name}
          className={`menu-item ${activeTab === item.name ? "active" : ""}`}
          onClick={() => setActiveTab(item.name)}
        >
          {item.icon}
          <span>{item.name}</span>
        </div>
      ))}

      {/* 🌗 Dark Mode Toggle */}
      <div className="mode-toggle" onClick={() => setDarkMode(!darkMode)}>
        {darkMode ? <FaSun /> : <FaMoon />}
        <span>{darkMode ? "Light" : "Dark"}</span>
      </div>
    </div>
  );
}
