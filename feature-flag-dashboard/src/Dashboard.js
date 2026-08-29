import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  FiFlag,
  FiCheckCircle,
  FiPercent,
  FiUsers,
  FiLock,
  FiArrowRight,
  FiLayers,
} from "react-icons/fi";
import { useAuth } from "./AuthContext";
import { getFeatures } from "./api/featureService";
import { getUsers } from "./api/userService";
import { SkeletonStatCard } from "./components/common/Loading";
import useCountUp from "./components/common/useCountUp";
import "./components/dashboard/DashboardComponents.css";

const ENVIRONMENTS = ["development", "staging", "production"];

function StatCard({ icon, title, value, borderColor, textColor }) {
  const animated = useCountUp(value);
  return (
    <div className={`ffc-stat-card border-${borderColor}`}>
      <div className={`ffc-stat-icon text-${textColor}`}>{icon}</div>
      <div className="ffc-stat-details">
        <span className="ffc-stat-title">{title}</span>
        <span className="ffc-stat-value">{animated}</span>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const isViewer = user?.role === "viewer";
  const isAdmin = user?.role === "admin";

  const [features, setFeatures] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      try {
        const featuresRes = await getFeatures();
        if (!cancelled) setFeatures(featuresRes.data?.data || []);
      } catch (err) {
        console.error("Error loading features:", err);
        toast.error(err.message || "Failed to load features");
      }

      if (isAdmin) {
        try {
          const usersRes = await getUsers();
          if (!cancelled) setUsers(usersRes.data?.data || []);
        } catch (err) {
          console.error("Error loading users:", err);
        }
      }

      if (!cancelled) setLoading(false);
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [isAdmin]);

  const enabledCount = features.filter((f) => f.enabled).length;
  const avgRollout = features.length
    ? Math.round(features.reduce((sum, f) => sum + (f.rollout || 0), 0) / features.length)
    : 0;
  const recentFeatures = [...features]
    .sort((a, b) => new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0))
    .slice(0, 5);

  const emailName = user?.email ? user.email.split("@")[0] : "there";

  return (
    <div className="ffc-dashboard-container">
      <div className="ffc-welcome-banner ffc-anim-in">
        <h2>Welcome back, {emailName} 👋</h2>
        <p>
          {isAdmin && "Here's what's happening across your feature flags and team today."}
          {user?.role === "developer" && "Here's the current state of your flags and rollouts."}
          {isViewer && "Here's a read-only snapshot of the current flag status."}
        </p>
      </div>

      {isViewer && (
        <div className="ffc-read-only-banner">
          <FiLock className="ffc-lock-banner-icon" />
          <div>
            <h4>You're in read-only mode</h4>
            <p>Viewers can see flags, environments, and audit history, but can't make changes.</p>
          </div>
        </div>
      )}

      <div className="ffc-stats-grid ffc-stagger">
        {loading ? (
          <>
            <SkeletonStatCard />
            <SkeletonStatCard />
            <SkeletonStatCard />
            <SkeletonStatCard />
          </>
        ) : (
          <>
            <StatCard
              icon={<FiFlag />}
              title="Total Flags"
              value={features.length}
              borderColor="blue"
              textColor="blue"
            />
            <StatCard
              icon={<FiCheckCircle />}
              title="Enabled"
              value={enabledCount}
              borderColor="green"
              textColor="green"
            />
            <StatCard
              icon={<FiPercent />}
              title="Avg. Rollout"
              value={avgRollout}
              borderColor="purple"
              textColor="purple"
            />
            {isAdmin ? (
              <StatCard
                icon={<FiUsers />}
                title="Team Members"
                value={users.length}
                borderColor="amber"
                textColor="amber"
              />
            ) : (
              <StatCard
                icon={<FiLayers />}
                title="Environments"
                value={ENVIRONMENTS.length}
                borderColor="cyan"
                textColor="cyan"
              />
            )}
          </>
        )}
      </div>

      <div className="ffc-dashboard-grid">
        <div className="ffc-dashboard-col-8">
          <div className="ffc-panel">
            <div className="ffc-panel-header">
              <h3>Recently updated flags</h3>
              <button className="ffc-panel-link" onClick={() => navigate("/features")}>
                View all <FiArrowRight />
              </button>
            </div>
            <div className="ffc-panel-body">
              {recentFeatures.length === 0 ? (
                <p className="ffc-no-data-text">No feature flags yet.</p>
              ) : (
                <div className="ffc-recent-list">
                  {recentFeatures.map((f) => (
                    <div
                      className="ffc-recent-item"
                      key={f._id}
                      onClick={() => navigate("/features")}
                    >
                      <div className="ffc-recent-item-info">
                        <span className="ffc-recent-item-title">{f.name}</span>
                        {f.description && (
                          <span className="ffc-recent-item-desc">{f.description}</span>
                        )}
                      </div>
                      <span className={`ffc-badge-pill ${f.enabled ? "on" : "off"}`}>
                        {f.enabled ? "Enabled" : "Disabled"}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="ffc-dashboard-col-4">
          <div className="ffc-panel">
            <div className="ffc-panel-header">
              <h3>Environment overview</h3>
              <button className="ffc-panel-link" onClick={() => navigate("/environments")}>
                Details <FiArrowRight />
              </button>
            </div>
            <div className="ffc-panel-body">
              <div className="ffc-env-overview">
                {ENVIRONMENTS.map((env) => {
                  const onCount = features.filter(
                    (f) => (f.environments?.[env] ?? f.enabled) === true
                  ).length;
                  return (
                    <div className="ffc-env-row" key={env}>
                      <span className="ffc-env-name">{env}</span>
                      <div className="ffc-env-progress">
                        <span className="ffc-env-progress-tag on">{onCount} on</span>
                        <span className="ffc-env-progress-tag off">
                          {features.length - onCount} off
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {isAdmin && (
            <div className="ffc-panel">
              <div className="ffc-panel-header">
                <h3>Team</h3>
                <button className="ffc-panel-link" onClick={() => navigate("/users")}>
                  Manage <FiArrowRight />
                </button>
              </div>
              <div className="ffc-panel-body">
                {users.length === 0 ? (
                  <p className="ffc-no-data-text">No other users yet.</p>
                ) : (
                  <div className="ffc-recent-users">
                    {users.slice(0, 5).map((u) => (
                      <div className="ffc-user-row" key={u._id}>
                        <div className="ffc-user-info">
                          <span className="ffc-user-email-short">{u.email}</span>
                          <span className="ffc-badge-pill inherit">{u.role}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
