import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaTrash, FaEdit, FaToggleOn, FaToggleOff } from "react-icons/fa";

export default function FeatureList({ features, toggle, edit, remove }) {
  return (
    <div className="features-container">
      <AnimatePresence>
        {features.length === 0 ? (
          <motion.p
            key="empty"
            className="no-features"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            No features found.
          </motion.p>
        ) : (
          features.map((f) => (
            <motion.div
              key={f._id}
              className="feature-card"
              layout
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{
                opacity: 0,
                x: 100,
                scale: 0.9,
                transition: { duration: 0.4, ease: "easeInOut" },
              }}
            >
              <div>
                <h3>{f.name}</h3>
                <p>{f.description}</p>
                <small>Rollout: {f.rollout}%</small>
              </div>

              <div className="actions">
                {/* 🔘 Toggle Button */}
                <button onClick={() => toggle(f._id, !f.enabled)}>
                  {f.enabled ? (
                    <FaToggleOn color="#22c55e" />
                  ) : (
                    <FaToggleOff color="#9ca3af" />
                  )}
                </button>

                {/* ✏️ Edit Button */}
                <button onClick={() => edit(f)}>
                  <FaEdit color="#facc15" />
                </button>

                {/* 🗑️ Delete Button — cool animation */}
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  whileHover={{
                    scale: 1.15,
                    rotate: -10,
                    transition: { duration: 0.2 },
                  }}
                  onClick={() => remove(f._id)}
                >
                  <FaTrash color="#ef4444" />
                </motion.button>
              </div>
            </motion.div>
          ))
        )}
      </AnimatePresence>
    </div>
  );
}
