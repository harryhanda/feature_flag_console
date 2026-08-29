import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FiCode, FiLayers, FiServer, FiCheckCircle } from "react-icons/fi";
import { getFeatures } from "../../api/featureService";
import { SkeletonTable } from "../common/Loading";
import { ErrorInline } from "../common/ErrorState";
import "../dashboard/DashboardComponents.css";
import "./Environments.css";

const ENV_META = {
  development: {
    label: "development",
    icon: FiCode,
    border: "border-dev",
    bg: "bg-dev",
    desc: "Where new flags are tested first. Safe to experiment freely here.",
    host: "dev.internal",
  },
  staging: {
    label: "staging",
    icon: FiLayers,
    border: "border-staging",
    bg: "bg-staging",
    desc: "Pre-production. Mirrors real traffic patterns before a full rollout.",
    host: "staging.yourapp.com",
  },
  production: {
    label: "production",
    icon: FiServer,
    border: "border-production",
    bg: "bg-production",
    desc: "Live traffic. Overrides here take effect for real users immediately.",
    host: "app.yourapp.com",
  },
};

const ENVIRONMENTS = ["development", "staging", "production"];

export default function EnvironmentsPage() {
  const [features, setFeatures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    (async () => {
      setLoading(true);
      setLoadError("");
      try {
        const res = await getFeatures();
        setFeatures(res.data?.data || []);
      } catch (err) {
        setLoadError(err.message || "Failed to load environments");
        toast.error(err.message || "Failed to load environments");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <div className="ffc-environments-container">
        <SkeletonTable rows={5} />
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="ffc-environments-container">
        <ErrorInline title="Couldn't load environments" message={loadError} />
      </div>
    );
  }

  return (
    <div className="ffc-environments-container">
      <div className="ffc-env-grid">
        {ENVIRONMENTS.map((env) => {
          const meta = ENV_META[env];
          const Icon = meta.icon;

          // A flag's on/off state in this environment is its env-specific
          // override if one is set, otherwise it falls back to the flag's
          // default `enabled` value. This is the only per-environment data
          // the backend actually provides — there's no per-environment
          // rollout percentage, just a single `rollout` value per flag.
          const activeInEnv = features.filter(
            (f) => (f.environments?.[env] ?? f.enabled) === true
          );
          const onCount = activeInEnv.length;

          // So "Avg Rollout" is averaged only over the flags that are
          // actually active in *this* environment, which is why the number
          // can genuinely differ across cards even though rollout itself
          // isn't stored per environment.
          const avgRollout = activeInEnv.length
            ? Math.round(
                activeInEnv.reduce((sum, f) => sum + (f.rollout || 0), 0) / activeInEnv.length
              )
            : 0;

          return (
            <div className={`ffc-env-card ${meta.border}`} key={env}>
              <div className="ffc-env-card-header">
                <div className={`ffc-env-card-icon ${meta.bg}`}>
                  <Icon />
                </div>
                <h3 className="ffc-env-card-name">{meta.label}</h3>
              </div>

              <p className="ffc-env-card-desc">{meta.desc}</p>

              <div className="ffc-env-card-divider" />

              <div className="ffc-env-card-metrics">
                <div className="ffc-env-metric">
                  <span className="ffc-env-metric-value">
                    {onCount}/{features.length}
                  </span>
                  <span className="ffc-env-metric-label">Flags On</span>
                </div>
                <div className="ffc-env-metric">
                  <span className="ffc-env-metric-value">{onCount ? `${avgRollout}%` : "—"}</span>
                  <span className="ffc-env-metric-label">Avg Rollout (Active Flags)</span>
                </div>
              </div>

              <p className="ffc-env-card-note">
                Rollout % is set per flag, not per environment — this is the average
                across flags that are on in {meta.label}.
              </p>

              <div className="ffc-env-card-footer">
                <span className="ffc-env-host-tag">
                  <FiCheckCircle /> Active
                </span>
                <span className="ffc-env-host">{meta.host}</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="ffc-panel">
        <div className="ffc-panel-header">
          <h3>Flag status by environment</h3>
        </div>
        <div className="ffc-responsive-table">
          <table className="ffc-table">
            <thead>
              <tr>
                <th>Feature</th>
                {ENVIRONMENTS.map((env) => (
                  <th key={env}>{env}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {features.length === 0 ? (
                <tr>
                  <td colSpan={ENVIRONMENTS.length + 1} style={{ textAlign: "center" }}>
                    No feature flags yet.
                  </td>
                </tr>
              ) : (
                features.map((f) => (
                  <tr key={f._id}>
                    <td className="ffc-table-main-cell">{f.name}</td>
                    {ENVIRONMENTS.map((env) => {
                      const override = f.environments?.[env];
                      const resolved = override ?? f.enabled;
                      const kind = override === undefined ? "inherit" : resolved ? "on" : "off";
                      return (
                        <td key={env}>
                          <span className={`ffc-badge-pill ${kind}`}>
                            {kind === "inherit" ? "Inherit" : resolved ? "On" : "Off"}
                          </span>
                        </td>
                      );
                    })}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
