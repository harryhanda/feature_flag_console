import React, { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiX, FiAlertCircle } from "react-icons/fi";
import "./FeatureForm.css";

const ENVIRONMENTS = ["development", "staging", "production"];

// Modal used to create/edit a feature flag. Rendered by FeaturesPage.
export default function FeatureForm({ open, form, setForm, onSubmit, onClose, editing, error }) {
  const nameInputRef = useRef(null);
  const triggerRef = useRef(null);

  // Escape closes the modal, same as clicking the backdrop or Cancel.
  useEffect(() => {
    if (!open) return;
    function handleKeyDown(e) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  // Move focus into the modal when it opens, and back to whatever button
  // opened it (New flag / Edit) when it closes.
  useEffect(() => {
    if (open) {
      triggerRef.current = document.activeElement;
      nameInputRef.current?.focus();
    } else {
      triggerRef.current?.focus?.();
    }
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="ffc-modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
        >
          <div
            className="ffc-modal-card"
            role="dialog"
            aria-modal="true"
            aria-labelledby="ffc-feature-modal-title"
          >
            <div className="ffc-modal-header">
              <h3 id="ffc-feature-modal-title">
                {editing ? "Edit feature flag" : "New feature flag"}
              </h3>
              <button className="ffc-modal-close-btn" onClick={onClose} aria-label="Close dialog">
                <FiX />
              </button>
            </div>

            <form className="ffc-modal-form" onSubmit={onSubmit}>
              <div className="ffc-modal-body">
                <div className="ffc-modal-field">
                  <label className="ffc-modal-label" htmlFor="ff-name">
                    Name
                  </label>
                  <input
                    id="ff-name"
                    ref={nameInputRef}
                    className="ffc-modal-input"
                    type="text"
                    placeholder="e.g. new-checkout-flow"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                  />
                </div>

                <div className="ffc-modal-field">
                  <label className="ffc-modal-label" htmlFor="ff-desc">
                    Description
                  </label>
                  <textarea
                    id="ff-desc"
                    className="ffc-modal-textarea"
                    placeholder="What does this flag control?"
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                  />
                </div>

                <div className="ffc-modal-field">
                  <label className="ffc-modal-label" htmlFor="ff-rollout">
                    Rollout: {form.rollout}%
                  </label>
                  <input
                    id="ff-rollout"
                    className="ffc-modal-range"
                    type="range"
                    min="0"
                    max="100"
                    value={form.rollout}
                    onChange={(e) => setForm({ ...form, rollout: Number(e.target.value) })}
                  />
                  <div className="ffc-modal-range-labels">
                    <span>0%</span>
                    <span>100%</span>
                  </div>
                </div>

                <label className="ffc-modal-checkbox-label">
                  <input
                    type="checkbox"
                    className="ffc-modal-checkbox"
                    checked={!!form.enabled}
                    onChange={(e) => setForm({ ...form, enabled: e.target.checked })}
                  />
                  <span className="ffc-modal-checkbox-text">
                    <strong>Enabled by default</strong>
                    <span>Used when an environment has no override below.</span>
                  </span>
                </label>

                <div className="ffc-modal-section">
                  <p className="ffc-modal-section-title">Environment overrides</p>
                  <p className="ffc-modal-section-desc">
                    Force this flag on or off in a specific environment, or leave it to inherit
                    the default above.
                  </p>

                  <div className="ffc-env-overrides-list">
                    {ENVIRONMENTS.map((env) => {
                      const current = form.environments?.[env];
                      const value = current === undefined ? "inherit" : current ? "on" : "off";
                      return (
                        <div className="ffc-env-override-row" key={env}>
                          <span className="ffc-env-override-label">{env}</span>
                          <select
                            className="ffc-env-override-select"
                            value={value}
                            onChange={(e) => {
                              const next = { ...(form.environments || {}) };
                              if (e.target.value === "inherit") delete next[env];
                              else next[env] = e.target.value === "on";
                              setForm({ ...form, environments: next });
                            }}
                          >
                            <option value="inherit">Inherit</option>
                            <option value="on">Force ON</option>
                            <option value="off">Force OFF</option>
                          </select>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {error && (
                  <div className="ffc-modal-field-error">
                    <FiAlertCircle />
                    <span>{error}</span>
                  </div>
                )}
              </div>

              <div className="ffc-modal-footer">
                <button
                  type="button"
                  className="ffc-action-btn secondary"
                  onClick={onClose}
                  aria-label="Cancel and close dialog"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="ffc-action-btn primary"
                  aria-label={editing ? "Save changes to feature flag" : "Create new feature flag"}
                >
                  {editing ? "Save changes" : "Create flag"}
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
