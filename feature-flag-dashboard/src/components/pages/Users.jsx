import React, { useEffect, useState } from "react";
import { useAuth } from "../../AuthContext";
import { getUsers, updateUserRole, deleteUser } from "../../api/userService";
import toast from "react-hot-toast";
import { FiTrash2, FiUsers } from "react-icons/fi";
import { SkeletonTable } from "../common/Loading";
import EmptyState from "../common/EmptyState";
import { ErrorPage } from "../common/ErrorState";
import "../dashboard/DashboardComponents.css";

export default function Users() {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && user.role === "admin") {
      loadUsers();
    } else {
      setLoading(false);
    }
  }, [user]);

  async function loadUsers() {
    setLoading(true);
    try {
      const res = await getUsers();
      setUsers(res.data.data);
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  }

  async function updateRole(id, role) {
    try {
      await updateUserRole(id, role);
      toast.success("Role updated");
      loadUsers();
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Role update failed");
    }
  }

  async function removeUser(id) {
    if (!window.confirm("Delete this user?")) return;
    try {
      await deleteUser(id);
      toast.success("User deleted");
      loadUsers();
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Delete failed");
    }
  }

  if (user === undefined) {
    return <SkeletonTable rows={4} />;
  }

  if (user === null) {
    return <ErrorPage title="Not logged in" description="Please sign in to continue." />;
  }

  if (user.role !== "admin") {
    return (
      <ErrorPage
        title="Access denied"
        description="Only admins can manage users. Ask an admin for access if you need this."
      />
    );
  }

  return (
    <div className="ffc-dashboard-container">
      <div className="ffc-panel">
        <div className="ffc-panel-header">
          <h3>Users</h3>
        </div>
        <div className="ffc-panel-body no-padding">
          {loading ? (
            <div style={{ padding: 24 }}>
              <SkeletonTable rows={4} />
            </div>
          ) : users.length === 0 ? (
            <EmptyState icon={<FiUsers />} title="No users found" />
          ) : (
            <div className="ffc-table-container">
              <table className="ffc-table">
                <thead>
                  <tr>
                    <th>Email</th>
                    <th>Role</th>
                    <th className="text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr className="ffc-table-row" key={u._id}>
                      <td>{u.email}</td>
                      <td>
                        <select
                          value={u.role}
                          disabled={u._id === user._id}
                          onChange={(e) => updateRole(u._id, e.target.value)}
                          className="ffc-env-override-select"
                          style={{ width: 150 }}
                        >
                          <option value="admin">admin</option>
                          <option value="developer">developer</option>
                          <option value="viewer">viewer</option>
                        </select>
                      </td>
                      <td className="text-right">
                        {u._id !== user._id && (
                          <button
                            className="ffc-row-action-btn delete"
                            onClick={() => removeUser(u._id)}
                            title="Delete user"
                          >
                            <FiTrash2 />
                          </button>
                        )}
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
