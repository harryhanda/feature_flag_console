import React from "react";
import "./EmptyState.css";

export default function EmptyState({ icon, title, description, actionLabel, onAction }) {
  return (
    <div className="ffc-empty-state">
      {icon && <div className="ffc-empty-icon">{icon}</div>}
      {title && <h3 className="ffc-empty-title">{title}</h3>}
      {description && <p className="ffc-empty-desc">{description}</p>}
      {actionLabel && onAction && (
        <button className="ffc-empty-btn" onClick={onAction}>
          {actionLabel}
        </button>
      )}
    </div>
  );
}
