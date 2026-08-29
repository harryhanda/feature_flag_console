import React from "react";
import { FiLock, FiAlertTriangle } from "react-icons/fi";
import "./ErrorState.css";

// Full-page error / access-denied state (e.g. wrong role for a route).
export function ErrorPage({ title = "Access denied", description }) {
  return (
    <div className="ffc-error-page">
      <div className="ffc-error-card">
        <div className="ffc-error-lock-icon">
          <FiLock />
        </div>
        <h2 className="ffc-error-title">{title}</h2>
        {description && <p className="ffc-error-desc">{description}</p>}
      </div>
    </div>
  );
}

// Inline error banner (e.g. under a form, or above a list that failed to load).
export function ErrorInline({ title = "Something went wrong", message }) {
  return (
    <div className="ffc-error-inline">
      <FiAlertTriangle className="ffc-error-inline-icon" />
      <div>
        <p className="ffc-error-inline-title">{title}</p>
        {message && <p className="ffc-error-inline-msg">{message}</p>}
      </div>
    </div>
  );
}

export default ErrorPage;
