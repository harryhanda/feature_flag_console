import React from "react";
import "./RoleBadge.css";

// Small pill used in sidebars/navbars/dropdowns to show a user's role.
// Class names follow the ffc-role-{role} convention defined in RoleBadge.css.
export default function RoleBadge({ role }) {
  const normalized = (role || "viewer").toLowerCase();
  return (
    <span className={`ffc-role-badge ffc-role-${normalized}`}>
      {normalized}
    </span>
  );
}
