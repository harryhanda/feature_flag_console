import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiEdit2, FiTrash2, FiToggleLeft, FiToggleRight, FiEye } from "react-icons/fi";
import EmptyState from "./common/EmptyState";
import "./FeatureList.css";

export default function FeatureList({ features, toggle, edit, remove, readOnly, emptyLabel }) {
  if (!features || features.length === 0) {
    return (
      <EmptyState
        icon={<FiEye />}
        title="No features found"
        description={emptyLabel || "Try a different search, or create your first feature flag."}
      />
    );
  }

  return (
    <div className="ffc-table-container">
      <table className="ffc-table">
        <thead>
          <tr>
            <th>Feature</th>
            <th>Rollout</th>
            <th>Status</th>
            <th className="text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          <AnimatePresence initial={false}>
            {features.map((f) => (
              <motion.tr
                key={f._id}
                className="ffc-table-row"
                layout
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: 60 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
              >
                <td className="ffc-feature-desc-cell">
                  <div className="ffc-feature-name-cell">
                    <span className="ffc-feature-name">{f.name}</span>
                    {f.description && <span className="ffc-feature-desc">{f.description}</span>}
                  </div>
                </td>
                <td>
                  <span className="ffc-rollout-badge">{f.rollout ?? 0}%</span>
                </td>
                <td>
                  <span className={`ffc-badge-pill ${f.enabled ? "on" : "off"}`}>
                    {f.enabled ? "Enabled" : "Disabled"}
                  </span>
                </td>
                <td className="text-right">
                  {readOnly ? (
                    <span className="ffc-action-read-only-icon" title="Read-only">
                      <FiEye />
                    </span>
                  ) : (
                    <span className="ffc-row-actions">
                      <button
                        className={`ffc-row-action-btn toggle ${f.enabled ? "on" : ""}`}
                        onClick={() => toggle(f._id, !f.enabled)}
                        title={f.enabled ? "Disable" : "Enable"}
                      >
                        {f.enabled ? <FiToggleRight /> : <FiToggleLeft />}
                      </button>
                      <button
                        className="ffc-row-action-btn edit"
                        onClick={() => edit(f)}
                        title="Edit"
                      >
                        <FiEdit2 />
                      </button>
                      <button
                        className="ffc-row-action-btn delete"
                        onClick={() => remove(f._id)}
                        title="Delete"
                      >
                        <FiTrash2 />
                      </button>
                    </span>
                  )}
                </td>
              </motion.tr>
            ))}
          </AnimatePresence>
        </tbody>
      </table>
    </div>
  );
}
