import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FiPlus, FiSearch } from "react-icons/fi";
import { useAuth } from "../../AuthContext";
import FeatureForm from "../FeatureForm";
import FeatureList from "../FeatureList";
import ConfirmDialog from "../common/ConfirmDialog";
import { SkeletonTable } from "../common/Loading";
import { ErrorInline } from "../common/ErrorState";
import {
  getFeatures,
  addFeature,
  updateFeature,
  deleteFeature,
} from "../../api/featureService";
import "../dashboard/DashboardComponents.css";

const EMPTY_FORM = { name: "", description: "", rollout: 0, enabled: false, environments: {} };

export default function FeaturesPage() {
  const { user } = useAuth();
  const readOnly = user?.role === "viewer";

  const [features, setFeatures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [search, setSearch] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editing, setEditing] = useState(null);
  const [formError, setFormError] = useState("");

  const [pendingDelete, setPendingDelete] = useState(null);

  const loadFeatures = async () => {
    setLoading(true);
    setLoadError("");
    try {
      const res = await getFeatures();
      setFeatures(res.data?.data || []);
    } catch (err) {
      console.error("Error loading features:", err);
      setLoadError(err.message || "Failed to load features");
      toast.error(err.message || "Failed to load features");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFeatures();
  }, []);

  const openCreate = () => {
    setForm(EMPTY_FORM);
    setEditing(null);
    setFormError("");
    setModalOpen(true);
  };

  const openEdit = (f) => {
    setForm({
      name: f.name,
      description: f.description || "",
      rollout: f.rollout || 0,
      enabled: !!f.enabled,
      environments: f.environments || {},
    });
    setEditing(f._id);
    setFormError("");
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    try {
      if (editing) {
        await updateFeature(editing, form);
        toast.success("Feature updated!");
      } else {
        await addFeature(form);
        toast.success("Feature added!");
      }
      setModalOpen(false);
      setForm(EMPTY_FORM);
      setEditing(null);
      loadFeatures();
    } catch (err) {
      setFormError(err.message || "Something went wrong");
      toast.error(err.message || "Something went wrong!");
    }
  };

  const requestDelete = (id) => {
    const f = features.find((x) => x._id === id);
    setPendingDelete(f || { _id: id, name: "this flag" });
  };

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    const id = pendingDelete._id;
    setPendingDelete(null);
    try {
      await deleteFeature(id);
      toast.success("Feature deleted!");
      loadFeatures();
    } catch (err) {
      toast.error(err.message || "Delete failed!");
    }
  };

  const handleToggle = async (id, enabled) => {
    try {
      const f = features.find((x) => x._id === id);
      await updateFeature(id, { ...f, enabled });
      loadFeatures();
    } catch (err) {
      toast.error(err.message || "Toggle failed!");
    }
  };

  const filtered = features.filter((f) =>
    f.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="ffc-dashboard-container">
      <div className="ffc-panel">
        <div className="ffc-panel-toolbar">
          <div className="ffc-search-wrapper">
            <FiSearch className="ffc-search-icon" />
            <input
              className="ffc-search-input"
              type="text"
              placeholder="Search features..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {!readOnly && (
            <button
              className="ffc-action-btn primary"
              style={{ marginLeft: "auto" }}
              onClick={openCreate}
            >
              <FiPlus /> New flag
            </button>
          )}
        </div>

        <div className="ffc-panel-body no-padding">
          {loading ? (
            <div style={{ padding: 24 }}>
              <SkeletonTable rows={5} />
            </div>
          ) : loadError ? (
            <div style={{ padding: 24 }}>
              <ErrorInline title="Couldn't load features" message={loadError} />
            </div>
          ) : (
            <FeatureList
              features={filtered}
              toggle={handleToggle}
              edit={openEdit}
              remove={requestDelete}
              readOnly={readOnly}
              emptyLabel={
                search
                  ? "No features match your search."
                  : "No features yet — create your first one to get started."
              }
            />
          )}
        </div>
      </div>

      <FeatureForm
        open={modalOpen}
        form={form}
        setForm={setForm}
        onSubmit={handleSubmit}
        onClose={() => setModalOpen(false)}
        editing={editing}
        error={formError}
      />

      <ConfirmDialog
        open={!!pendingDelete}
        title="Delete this feature flag?"
        message={
          pendingDelete
            ? `Are you sure you want to delete "${pendingDelete.name}"? This can't be undone.`
            : ""
        }
        confirmLabel="Delete"
        cancelLabel="Cancel"
        onConfirm={confirmDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  );
}
