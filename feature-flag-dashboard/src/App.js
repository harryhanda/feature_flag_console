import React, { useEffect, useState } from "react";
import "./App.css";
import Sidebar from "./components/Sidebar";
import FeatureList from "./components/FeatureList";
import FeatureForm from "./components/FeatureForm";
import Toast from "./components/Toast";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import {
  getFeatures,
  addFeature,
  updateFeature,
  deleteFeature,
} from "./api/featureService";

export default function App() {
  const [features, setFeatures] = useState([]);
  const [form, setForm] = useState({ name: "", description: "", rollout: 0 });
  const [editing, setEditing] = useState(null);
  const [activeTab, setActiveTab] = useState("Features");
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [darkMode, setDarkMode] = useState(false);

  // 🧠 Load all features from backend
  const loadFeatures = async () => {
    setLoading(true);
    try {
      const res = await getFeatures();
      setFeatures(res.data || []); // handle undefined gracefully
    } catch (err) {
      console.error("Error loading features:", err);
      toast.error("Failed to load features");
    } finally {
      setLoading(false);
    }
  };

  // 🔁 Load on mount
  useEffect(() => {
    loadFeatures();
  }, []);

  // ➕ Add or Update Feature
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await updateFeature(editing, form);
        toast.success("Feature updated!");
      } else {
        await addFeature(form);
        toast.success("Feature added!");
      }

      setForm({ name: "", description: "", rollout: 0 });
      setEditing(null);
      loadFeatures();
    } catch (err) {
      console.error("Error saving feature:", err);
      toast.error("Something went wrong!");
    }
  };

  // 🗑️ Delete Feature
  const handleDelete = async (id) => {
    try {
      await deleteFeature(id);
      toast.success("Feature deleted!");
      loadFeatures();
    } catch (err) {
      console.error("Error deleting feature:", err);
      toast.error("Delete failed!");
    }
  };

  // 🔘 Toggle Feature (enable/disable)
  const handleToggle = async (id, enabled) => {
    const feature = features.find((f) => f._id === id);
    if (!feature) return;
    try {
      await updateFeature(id, { ...feature, enabled });
      loadFeatures();
    } catch (err) {
      console.error("Error toggling feature:", err);
      toast.error("Toggle failed!");
    }
  };

  // 🔍 Filter features by name
  const filtered = features.filter((f) =>
    f.name.toLowerCase().includes(search.toLowerCase())
  );

  // 🌙 Main Render
  return (
    <div className="app-layout">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
      />

      <div className={`main ${darkMode ? "dark" : ""}`}>
        <Toast />

        {activeTab === "Features" ? (
          <>
            <div className="toolbar">
              <input
                type="text"
                placeholder="Search features..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <FeatureForm
              form={form}
              setForm={setForm}
              onSubmit={handleSubmit}
              editing={editing}
            />

            {loading ? (
              <p>⏳ Loading...</p>
            ) : filtered.length > 0 ? (
              <FeatureList
                features={filtered}
                toggle={handleToggle}
                edit={(f) => {
                  setEditing(f._id);
                  setForm(f);
                }}
                remove={handleDelete}
              />
            ) : (
              <p>🚫 No features found.</p>
            )}
          </>
        ) : (
          <p style={{ marginTop: "50px" }}>Coming soon: {activeTab} panel</p>
        )}

        {/* ✨ Optional smooth floating icon animation */}
        <motion.div
          className="dustbin"
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 3 }}
          style={{
            position: "fixed",
            bottom: "20px",
            right: "30px",
            fontSize: "24px",
          }}
        >
          🗑️
        </motion.div>
      </div>
    </div>
  );
}
