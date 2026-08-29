import React, { useState } from "react";
import { useAuth } from "../../AuthContext";
import { changePassword as changePasswordApi } from "../../api/authService";
import RoleBadge from "../common/RoleBadge";
import { FiUser, FiLock, FiCheckCircle, FiAlertCircle } from "react-icons/fi";
import "./settings.css";

export default function Settings() {
  const { user, logout } = useAuth();
  const [oldPass, setOldPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [msg, setMsg] = useState("");
  const [msgType, setMsgType] = useState("success");
  const [saving, setSaving] = useState(false);

  if (!user) {
    return <p style={{ padding: 20 }}>Loading...</p>;
  }

  async function changePassword(e) {
    e.preventDefault();
    setSaving(true);
    setMsg("");
    try {
      await changePasswordApi(oldPass, newPass);
      setMsgType("success");
      setMsg("Password updated successfully!");
      setOldPass("");
      setNewPass("");
    } catch (err) {
      setMsgType("error");
      setMsg(err.message || "Old password incorrect");
    } finally {
      setSaving(false);
    }
  }

  const emailName = user.email ? user.email.split("@")[0] : "User";

  return (
    <div className="ffc-settings-container">
      <div className="ffc-settings-grid">
        {/* Left column: profile */}
        <div className="ffc-settings-card">
          <div className="ffc-settings-profile-body">
            <div className="ffc-settings-large-avatar">
              {user.email ? user.email.charAt(0).toUpperCase() : "U"}
            </div>
            <div className="ffc-settings-profile-info">
              <h4>{emailName}</h4>
              <span className="ffc-settings-profile-email">{user.email}</span>
              <RoleBadge role={user.role} />
            </div>
          </div>
          <div className="ffc-settings-profile-footer">
            <button className="ffc-settings-logout-btn" onClick={logout}>
              Log out
            </button>
          </div>
        </div>

        {/* Right column: forms */}
        <div>
          <div className="ffc-settings-card">
            <div className="ffc-settings-card-header">
              <FiLock className="ffc-settings-header-icon" />
              <h3>Change password</h3>
            </div>
            <div className="ffc-settings-card-body">
              <form className="ffc-settings-form" onSubmit={changePassword}>
                <div className="ffc-settings-field">
                  <label className="ffc-settings-label" htmlFor="old-pass">
                    Old password
                  </label>
                  <input
                    id="old-pass"
                    type="password"
                    className="ffc-settings-input"
                    value={oldPass}
                    onChange={(e) => setOldPass(e.target.value)}
                    disabled={saving}
                  />
                </div>
                <div className="ffc-settings-field">
                  <label className="ffc-settings-label" htmlFor="new-pass">
                    New password
                  </label>
                  <input
                    id="new-pass"
                    type="password"
                    className="ffc-settings-input"
                    value={newPass}
                    onChange={(e) => setNewPass(e.target.value)}
                    disabled={saving}
                  />
                </div>
                <button className="ffc-settings-save-btn" disabled={saving}>
                  {saving ? "Updating..." : "Update password"}
                </button>
              </form>

              {msg && (
                <div className={`ffc-settings-alert ${msgType}`}>
                  {msgType === "success" ? <FiCheckCircle /> : <FiAlertCircle />}
                  {msg}
                </div>
              )}
            </div>
          </div>

          <div className="ffc-settings-card">
            <div className="ffc-settings-card-header">
              <FiUser className="ffc-settings-header-icon" />
              <h3>Account details</h3>
            </div>
            <div className="ffc-settings-card-body">
              <div className="ffc-details-card">
                <span className="ffc-details-label">Account JSON</span>
                <pre className="ffc-details-json">
                  {JSON.stringify({ email: user.email, role: user.role }, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
