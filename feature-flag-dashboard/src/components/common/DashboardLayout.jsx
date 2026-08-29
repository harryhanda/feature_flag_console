import React from "react";
import { useAuth } from "../../AuthContext";
import AdminShell from "./AdminShell.jsx";
import DeveloperShell from "./DeveloperShell.jsx";
import ViewerShell from "./ViewerShell.jsx";
import "./DashboardLayout.css";

// Each role gets a structurally different shell (not just a recolor):
// Admin -> full command sidebar, Developer -> icon rail + editor-style tabs,
// Viewer -> minimal top nav, no sidebar at all. Whichever shell renders
// also stamps `data-role` on its root so every shared component (panels,
// tables, badges...) picks up the right palette from theme.css.
export default function DashboardLayout({ children }) {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="ffc-layout-loader">
        <div className="ffc-spinner ffc-spinner-lg ffc-spinner-primary" />
      </div>
    );
  }

  const role = (user.role || "").toLowerCase();

  if (role === "admin") return <AdminShell>{children}</AdminShell>;
  if (role === "developer") return <DeveloperShell>{children}</DeveloperShell>;
  return <ViewerShell>{children}</ViewerShell>;
}
