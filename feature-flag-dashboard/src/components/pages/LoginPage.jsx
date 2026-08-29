import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../AuthContext.js";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff,
  FiAlertCircle,
  FiShield,
  FiCode,
  FiEye as FiViewerEye,
  FiCheck,
  FiArrowRight,
} from "react-icons/fi";
import "./LoginPage.css";

const ROLES = [
  {
    key: "admin",
    label: "Admin",
    tagline: "Full control",
    detail: "Manage users, environments & every flag in the system.",
    icon: FiShield,
  },
  {
    key: "developer",
    label: "Developer",
    tagline: "Build & ship",
    detail: "Create, toggle and roll out flags across environments.",
    icon: FiCode,
  },
  {
    key: "viewer",
    label: "Viewer",
    tagline: "Read-only",
    detail: "Track flag status and audit history at a glance.",
    icon: FiViewerEye,
  },
];

export default function LoginPage() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [selectedRole, setSelectedRole] = useState("admin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Redirect as a side effect, not during render (calling navigate() while
  // rendering triggers a React "Cannot update a component while rendering
  // a different component" warning and can cause a double-render flash).
  useEffect(() => {
    if (isAuthenticated) navigate("/");
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return; // guard against duplicate submissions

    setError("");
    setLoading(true);

    try {
      await login(email, password);
      navigate("/");
    } catch (err) {
      // The API's message is preserved for genuine, useful cases (e.g. a
      // network/connectivity failure), but a failed-login response is
      // presented with a clean, professional message instead of a raw
      // backend string like "Invalid credentials" or "401 Unauthorized".
      if (err?.response) {
        setError("Please check your email and password and try again.");
      } else {
        setError(err.message || "Please check your email and password and try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="ffc-auth-page" data-role={selectedRole}>
      {/* Ambient aurora background */}
      <div className="ffc-aurora" aria-hidden="true">
        <span className="ffc-aurora-blob blob-1" />
        <span className="ffc-aurora-blob blob-2" />
        <span className="ffc-aurora-blob blob-3" />
        <div className="ffc-aurora-grid" />
      </div>

      <div className="ffc-auth-shell">
        {/* Brand */}
        <motion.div
          className="ffc-auth-brand"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <span className="ffc-auth-brand-mark">◈</span>
          <span>FF Console</span>
        </motion.div>

        <motion.h1
          className="ffc-auth-title"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.05, ease: "easeOut" }}
        >
          Choose how you're
          <br />
          <span className="ffc-auth-title-accent">walking in.</span>
        </motion.h1>
        <motion.p
          className="ffc-auth-subtitle"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
        >
          Every role gets its own console, tuned to what you actually do here.
        </motion.p>

        {/* Role portal cards */}
        <p className="ffc-role-portals-caption">
          Console preview — your actual role comes from your account after you sign in.
        </p>
        <div
          className="ffc-role-portals"
          role="radiogroup"
          aria-label="Preview console role (does not change your account role)"
        >
          {ROLES.map((r, i) => {
            const Icon = r.icon;
            const active = selectedRole === r.key;
            return (
              <motion.button
                type="button"
                key={r.key}
                className={`ffc-role-portal ${active ? "active" : ""}`}
                data-portal={r.key}
                role="radio"
                aria-checked={active}
                onClick={() => setSelectedRole(r.key)}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.15 + i * 0.08, ease: "easeOut" }}
                whileHover={{ y: -4 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="ffc-role-portal-icon">
                  <Icon />
                </span>
                <span className="ffc-role-portal-label">{r.label}</span>
                <span className="ffc-role-portal-tagline">{r.tagline}</span>
                <span className="ffc-role-portal-detail">{r.detail}</span>
                <AnimatePresence>
                  {active && (
                    <motion.span
                      className="ffc-role-portal-check"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                    >
                      <FiCheck />
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            );
          })}
        </div>

        {/* Form card */}
        <motion.div
          className="ffc-auth-card"
          key={selectedRole}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
        >
          <div className="ffc-auth-card-header">
            <h2 className="ffc-auth-card-title">Sign in</h2>
            <p className="ffc-auth-card-subtitle">
              Your account role decides your console — this just previews the theme.
            </p>
          </div>

          <form className="ffc-form" onSubmit={handleSubmit} noValidate>
            <div className="ffc-field">
              <label className="ffc-label" htmlFor="ffc-email">
                Email
              </label>
              <div className="ffc-input-wrap">
                <span className="ffc-input-icon" aria-hidden="true">
                  <FiMail />
                </span>
                <input
                  id="ffc-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  aria-required="true"
                  aria-invalid={!!error}
                  disabled={loading}
                />
              </div>
            </div>

            <div className="ffc-field">
              <label className="ffc-label" htmlFor="ffc-password">
                Password
              </label>
              <div className="ffc-input-wrap has-toggle">
                <span className="ffc-input-icon" aria-hidden="true">
                  <FiLock />
                </span>
                <input
                  id="ffc-password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  aria-required="true"
                  aria-invalid={!!error}
                  disabled={loading}
                />
                <button
                  type="button"
                  className="ffc-toggle-visibility"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  aria-pressed={showPassword}
                  tabIndex={0}
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>

            {error && (
              <div className="ffc-error" role="alert" aria-live="polite">
                <FiAlertCircle />
                <span>
                  <strong>Unable to sign in.</strong> {error}
                </span>
              </div>
            )}

            <button type="submit" className="ffc-submit" disabled={loading} aria-busy={loading}>
              {loading ? (
                <span className="ffc-spinner" aria-hidden="true" />
              ) : (
                <FiArrowRight aria-hidden="true" />
              )}
              {loading ? "Signing in..." : "Enter console"}
            </button>
          </form>

          <div className="ffc-auth-switch-row">
            Don&rsquo;t have an account?{" "}
            <button type="button" className="ffc-auth-switch-link" onClick={() => navigate("/register")}>
              Create one
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
