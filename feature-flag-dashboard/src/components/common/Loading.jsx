import React from "react";
import "./Loading.css";

// Small inline spinner: <Spinner size="sm|md|lg" tone="primary|white" />
export function Spinner({ size = "md", tone = "primary" }) {
  return (
    <span className="ffc-spinner-container">
      <span className={`ffc-spinner ffc-spinner-${size} ffc-spinner-${tone}`} />
      <span className="ffc-sr-only">Loading…</span>
    </span>
  );
}

// Full-panel loading state used while a page's data is being fetched.
export default function Loading({ label = "Loading…" }) {
  return (
    <div className="ffc-loading-full">
      <Spinner size="lg" tone="primary" />
      <span className="ffc-sr-only">{label}</span>
    </div>
  );
}

// Skeleton placeholder for a stat card grid while data loads.
export function SkeletonStatCard() {
  return (
    <div className="ffc-skeleton-card ffc-skeleton-animate">
      <div className="ffc-skeleton-title" />
      <div className="ffc-skeleton-value" />
      <div className="ffc-skeleton-subtitle" />
    </div>
  );
}

// Skeleton placeholder for a table while data loads.
export function SkeletonTable({ rows = 4 }) {
  return (
    <div className="ffc-skeleton-table ffc-skeleton-animate">
      <div className="ffc-skeleton-table-header" />
      {Array.from({ length: rows }).map((_, i) => (
        <div className="ffc-skeleton-table-row" key={i}>
          <div className="ffc-skeleton-table-cell" />
          <div className="ffc-skeleton-table-cell" />
          <div className="ffc-skeleton-table-cell" />
        </div>
      ))}
    </div>
  );
}
