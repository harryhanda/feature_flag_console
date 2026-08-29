import React, { useEffect, useRef, useState } from "react";
import { useAuth } from "../../AuthContext";
import { getAuditLogs } from "../../api/auditService";
import toast from "react-hot-toast";
import { FiSearch, FiFileText } from "react-icons/fi";
import { SkeletonTable } from "../common/Loading";
import EmptyState from "../common/EmptyState";
import { ErrorPage } from "../common/ErrorState";
import "../dashboard/DashboardComponents.css";

export default function AuditLog() {
  const { user } = useAuth();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ action: "", feature: "", user: "" });

  const canView = user && (user.role === "admin" || user.role === "developer");
  const debounceRef = useRef(null);

  async function fetchLogs(activeFilters = filters) {
    setLoading(true);
    try {
      const cleaned = Object.fromEntries(
        Object.entries(activeFilters).filter(([, v]) => v)
      );
      const res = await getAuditLogs(cleaned);
      setLogs(res.data.data);
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Failed to load audit logs");
    } finally {
      setLoading(false);
    }
  }

  // Debounce so typing in a filter field doesn't fire an API request on
  // every keystroke — we wait for a short pause before searching.
  useEffect(() => {
    if (!canView) {
      setLoading(false);
      return;
    }
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      fetchLogs(filters);
    }, 400);
    return () => clearTimeout(debounceRef.current);
  }, [filters, canView]);

  function handleFilterChange(field, value) {
    setFilters((prev) => ({ ...prev, [field]: value }));
  }

  if (!user) {
    return <SkeletonTable rows={4} />;
  }

  if (!canView) {
    return (
      <ErrorPage
        title="Access denied"
        description="Audit logs are visible to admins and developers only."
      />
    );
  }

  return (
    <div className="ffc-dashboard-container">
      <div className="ffc-panel">
        <div className="ffc-panel-toolbar" style={{ gap: 12, flexWrap: "wrap" }}>
          <div className="ffc-search-wrapper" style={{ maxWidth: 220 }}>
            <FiSearch className="ffc-search-icon" />
            <input
              className="ffc-search-input"
              placeholder="Filter by action"
              value={filters.action}
              onChange={(e) => handleFilterChange("action", e.target.value)}
            />
          </div>
          <div className="ffc-search-wrapper" style={{ maxWidth: 220 }}>
            <FiSearch className="ffc-search-icon" />
            <input
              className="ffc-search-input"
              placeholder="Filter by feature"
              value={filters.feature}
              onChange={(e) => handleFilterChange("feature", e.target.value)}
            />
          </div>
          <div className="ffc-search-wrapper" style={{ maxWidth: 220 }}>
            <FiSearch className="ffc-search-icon" />
            <input
              className="ffc-search-input"
              placeholder="Filter by user email"
              value={filters.user}
              onChange={(e) => handleFilterChange("user", e.target.value)}
            />
          </div>
        </div>

        <div className="ffc-panel-body no-padding">
          {loading ? (
            <div style={{ padding: 24 }}>
              <SkeletonTable rows={5} />
            </div>
          ) : logs.length === 0 ? (
            <EmptyState icon={<FiFileText />} title="No audit entries found" />
          ) : (
            <div className="ffc-table-container">
              <table className="ffc-table">
                <thead>
                  <tr>
                    <th>Action</th>
                    <th>User</th>
                    <th>Feature</th>
                    <th>Time</th>
                    <th>Details</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map((l) => (
                    <tr className="ffc-table-row" key={l._id}>
                      <td>{l.action}</td>
                      <td>{l.doneBy}</td>
                      <td>{l.feature || "—"}</td>
                      <td className="ffc-feature-date">
                        {new Date(l.timestamp).toLocaleString()}
                      </td>
                      <td>
                        <span className="ffc-feature-desc" style={{ maxWidth: 320 }}>
                          {JSON.stringify(
                            l.details ?? { oldValue: l.oldValue, newValue: l.newValue }
                          )}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
