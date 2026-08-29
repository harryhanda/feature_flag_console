import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./AuthContext.js";
import LoginPage from "./components/pages/LoginPage.jsx";
import RegisterPage from "./components/pages/RegisterPage.jsx";

import ProtectedRoute from "./ProtectedRoute.js";
import DashboardLayout from "./components/common/DashboardLayout.jsx";

import Dashboard from "./Dashboard.js";
import FeaturesPage from "./components/pages/FeaturesPage.jsx";
import EnvironmentsPage from "./components/pages/EnvironmentsPage.jsx";
import Users from "./components/pages/Users.jsx";
import AuditLog from "./components/pages/AuditLog.jsx";
import Settings from "./components/pages/Settings.jsx";

import "./App.css";

function Protected({ children }) {
  return (
    <ProtectedRoute>
      <DashboardLayout>{children}</DashboardLayout>
    </ProtectedRoute>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster
          position="top-right"
          toastOptions={{
            success: { style: { background: "#16a34a", color: "white" } },
            error: { style: { background: "#dc2626", color: "white" } },
            style: { borderRadius: "10px", background: "#333", color: "#fff" },
          }}
        />
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected Routes, each wrapped in the role-aware DashboardLayout */}
          <Route path="/" element={<Protected><Dashboard /></Protected>} />
          <Route path="/features" element={<Protected><FeaturesPage /></Protected>} />
          <Route path="/environments" element={<Protected><EnvironmentsPage /></Protected>} />
          <Route path="/users" element={<Protected><Users /></Protected>} />
          <Route path="/audit" element={<Protected><AuditLog /></Protected>} />
          <Route path="/settings" element={<Protected><Settings /></Protected>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
