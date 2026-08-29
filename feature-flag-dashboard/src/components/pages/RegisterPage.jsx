import React, { useState } from "react";
import { useAuth } from "../../AuthContext.js";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiMail,
  FiLock,
  FiUser,
  FiEye,
  FiEyeOff,
  FiAlertCircle,
  FiArrowRight,
  FiCheckCircle,
  FiInfo,
} from "react-icons/fi";
import "./LoginPage.css";

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    setError("");
    setLoading(true);

    try {
      await register(email, password, name);
      setSuccess(true);
    } catch (err) {
      setError(err?.response ? "Something went wrong creating your account. Please try again." : err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ffc-auth-page" data-role="viewer">
      <div className="ffc-aurora" aria-hidden="true">
        <span className="ffc-aurora-blob blob-1" />
        <span className="ffc-aurora-blob blob-2" />
        <span className="ffc-aurora-blob blob-3" />
        <div className="ffc-aurora-grid" />
      </div>

      <div className="ffc-auth-shell">
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
          Create your
          <br />
          <span className="ffc-auth-title-accent">console account.</span>
        </motion.h1>
        <motion.p
          className="ffc-auth-subtitle"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
        >
          Takes a few seconds. An admin can promote your access once you're in.
        </motion.p>

        {success ? (
          <motion.div
            className="ffc-success-panel"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <div className="ffc-success-icon">
              <FiCheckCircle />
            </div>
            <h2 className="ffc-auth-card-title">You're all set</h2>
            <p className="ffc-auth-card-subtitle" style={{ marginBottom: 24 }}>
              Your account was created as a <strong>Viewer</strong>. Sign in to explore your console.
            </p>
            <button type="button" className="ffc-submit" onClick={() => navigate("/login")}>
              <FiArrowRight aria-hidden="true" />
              Go to sign in
            </button>
          </motion.div>
        ) : (
          <>
            <motion.div
              className="ffc-role-note"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.15, ease: "easeOut" }}
            >
              <FiInfo />
              New accounts start as <strong>Viewer</strong> — an Admin can upgrade you to Developer or Admin later.
            </motion.div>

            <motion.div
              className="ffc-auth-card"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2, ease: "easeOut" }}
            >
              <div className="ffc-auth-card-header">
                <h2 className="ffc-auth-card-title">Register</h2>
                <p className="ffc-auth-card-subtitle">Create a new FF Console account.</p>
              </div>

              <form className="ffc-form" onSubmit={handleSubmit} noValidate>
                <div className="ffc-field">
                  <label className="ffc-label" htmlFor="ffc-name">
                    Full name
                  </label>
                  <div className="ffc-input-wrap">
                    <span className="ffc-input-icon" aria-hidden="true">
                      <FiUser />
                    </span>
                    <input
                      id="ffc-name"
                      name="name"
                      type="text"
                      autoComplete="name"
                      placeholder="Ada Lovelace"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      disabled={loading}
                    />
                  </div>
                </div>

                <div className="ffc-field">
                  <label className="ffc-label" htmlFor="ffc-reg-email">
                    Email
                  </label>
                  <div className="ffc-input-wrap">
                    <span className="ffc-input-icon" aria-hidden="true">
                      <FiMail />
                    </span>
                    <input
                      id="ffc-reg-email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      placeholder="you@company.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      aria-invalid={!!error}
                      disabled={loading}
                    />
                  </div>
                </div>

                <div className="ffc-field">
                  <label className="ffc-label" htmlFor="ffc-reg-password">
                    Password
                  </label>
                  <div className="ffc-input-wrap has-toggle">
                    <span className="ffc-input-icon" aria-hidden="true">
                      <FiLock />
                    </span>
                    <input
                      id="ffc-reg-password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      placeholder="Create a password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      aria-invalid={!!error}
                      disabled={loading}
                    />
                    <button
                      type="button"
                      className="ffc-toggle-visibility"
                      onClick={() => setShowPassword((v) => !v)}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      aria-pressed={showPassword}
                    >
                      {showPassword ? <FiEyeOff /> : <FiEye />}
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="ffc-error" role="alert" aria-live="polite">
                    <FiAlertCircle />
                    <span>{error}</span>
                  </div>
                )}

                <button type="submit" className="ffc-submit" disabled={loading} aria-busy={loading}>
                  {loading ? (
                    <span className="ffc-spinner" aria-hidden="true" />
                  ) : (
                    <FiArrowRight aria-hidden="true" />
                  )}
                  {loading ? "Creating account..." : "Create account"}
                </button>
              </form>

              <div className="ffc-auth-switch-row">
                Already have an account?{" "}
                <button type="button" className="ffc-auth-switch-link" onClick={() => navigate("/login")}>
                  Sign in
                </button>
              </div>
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
}
