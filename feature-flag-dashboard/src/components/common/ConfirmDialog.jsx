import React, { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiAlertTriangle } from "react-icons/fi";
import "../FeatureForm.css";
import "./ConfirmDialog.css";

// Small confirmation modal, reusing the same backdrop/card classes as
// FeatureForm so it looks like part of the same design system rather than
// a bolted-on library component.
export default function ConfirmDialog({
  open,
  title = "Are you sure?",
  message,
  confirmLabel = "Delete",
  cancelLabel = "Cancel",
  danger = true,
  onConfirm,
  onCancel,
}) {
  const confirmBtnRef = useRef(null);
  const triggerRef = useRef(null);

  // Remember whatever had focus before the dialog opened, so we can send
  // focus back there when it closes.
  useEffect(() => {
    if (open) {
      triggerRef.current = document.activeElement;
      confirmBtnRef.current?.focus();
    } else {
      triggerRef.current?.focus?.();
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function handleKeyDown(e) {
      if (e.key === "Escape") onCancel();
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onCancel]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="ffc-modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) onCancel();
          }}
        >
          <div
            className="ffc-modal-card ffc-confirm-card"
            role="dialog"
            aria-modal="true"
            aria-labelledby="ffc-confirm-title"
          >
            <div className="ffc-modal-header">
              <h3 id="ffc-confirm-title" className="ffc-confirm-title">
                <FiAlertTriangle className="ffc-confirm-icon" aria-hidden="true" />
                {title}
              </h3>
            </div>

            <div className="ffc-modal-body">
              <p className="ffc-confirm-message">{message}</p>
            </div>

            <div className="ffc-modal-footer">
              <button
                type="button"
                className="ffc-action-btn secondary"
                onClick={onCancel}
                aria-label={cancelLabel}
              >
                {cancelLabel}
              </button>
              <button
                type="button"
                ref={confirmBtnRef}
                className={`ffc-action-btn ${danger ? "danger" : "primary"}`}
                onClick={onConfirm}
                aria-label={confirmLabel}
              >
                {confirmLabel}
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
