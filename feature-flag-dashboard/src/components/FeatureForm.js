import React from "react";

export default function FeatureForm({ form, setForm, onSubmit, editing }) {
  return (
    <form className="feature-form" onSubmit={onSubmit}>
      <input
        type="text"
        placeholder="Feature name"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        required
      />
      <textarea
        placeholder="Feature description"
        value={form.description}
        onChange={(e) => setForm({ ...form, description: e.target.value })}
      />
      <input
        type="number"
        placeholder="Rollout %"
        value={form.rollout}
        min="0"
        max="100"
        onChange={(e) => setForm({ ...form, rollout: e.target.value })}
      />

      {/* ✅ Keep only one button */}
      <button type="submit">
        {editing ? "Update Feature" : "Add Feature"}
      </button>
    </form>
  );
}
