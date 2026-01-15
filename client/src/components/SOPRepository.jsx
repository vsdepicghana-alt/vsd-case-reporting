import React, { useState, useEffect } from "react";
import "./SOPRepository.css";

const CATEGORIES = [
  {
    title: "Equipment SOPs",
    key: "equipment",
  },
  {
    title: "Procedure SOPs",
    key: "procedures",
    subcategories: [
      "Bacteriology",
      "Clinical Pathology",
      "Parasitology",
      "Virology",
      "Molecular Diagnostics",
      "Serology & Immunology",
      "Sample Collection & Handling",
      "Quality Assurance & Biosafety",
      "Waste Management",
      "Laboratory Information Management",
    ],
  },
  {
    title: "Policy SOPs",
    key: "policies",
  },
  {
    title: "Administrative SOPs",
    key: "administrative",
  },
];

const STORAGE_KEY = "sop_repository";
const TRASH_KEY = "sop_trash";

export default function SOPRepository() {
  const [sops, setSops] = useState({});
  const [trash, setTrash] = useState({});
  const [confirmDelete, setConfirmDelete] = useState(null);

  useEffect(() => {
    setSops(JSON.parse(localStorage.getItem(STORAGE_KEY)) || {});
    setTrash(JSON.parse(localStorage.getItem(TRASH_KEY)) || {});
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sops));
  }, [sops]);

  useEffect(() => {
    localStorage.setItem(TRASH_KEY, JSON.stringify(trash));
  }, [trash]);

  /** Upload SOP */
  const handleUpload = (category, subcategory, file) => {
    if (!file) return;

    const record = {
      id: crypto.randomUUID(),
      name: file.name,
      category,
      subcategory,
      uploadedAt: new Date().toISOString(),
      fileURL: URL.createObjectURL(file),
    };

    setSops((prev) => ({
      ...prev,
      [category]: [...(prev[category] || []), record],
    }));
  };

  /** Move to trash */
  const deleteSOP = () => {
    const sop = confirmDelete;

    setSops((prev) => ({
      ...prev,
      [sop.category]: prev[sop.category].filter((s) => s.id !== sop.id),
    }));

    setTrash((prev) => ({
      ...prev,
      [sop.id]: {
        ...sop,
        deletedAt: Date.now(),
      },
    }));

    setConfirmDelete(null);
  };

  /** Restore SOP */
  const restoreSOP = (id) => {
    const sop = trash[id];
    if (!sop) return;

    setTrash((prev) => {
      const copy = { ...prev };
      delete copy[id];
      return copy;
    });

    setSops((prev) => ({
      ...prev,
      [sop.category]: [...(prev[sop.category] || []), sop],
    }));
  };

  /** Auto-clean trash after 30 days */
  useEffect(() => {
    const now = Date.now();
    const cleaned = Object.fromEntries(
      Object.entries(trash).filter(
        ([_, s]) => now - s.deletedAt < 30 * 24 * 60 * 60 * 1000
      )
    );
    setTrash(cleaned);
  }, [trash]);

  return (
    <div className="sop-container">
      <h2>📂 SOP Repository</h2>

      {CATEGORIES.map((cat) => (
        <div key={cat.key} className="sop-card">
          <h3>{cat.title}</h3>

          {cat.subcategories ? (
            cat.subcategories.map((sub) => (
              <SOPUploadBlock
                key={sub}
                label={sub}
                onUpload={(file) => handleUpload(cat.key, sub, file)}
              />
            ))
          ) : (
            <SOPUploadBlock
              label="Upload SOP"
              onUpload={(file) => handleUpload(cat.key, null, file)}
            />
          )}

          <DeleteButton
            onClick={() =>
              setConfirmDelete(
                (sops[cat.key] || [])[0] ? (sops[cat.key] || [])[0] : null
              )
            }
          />
        </div>
      ))}

      {/* TRASH */}
      <div className="sop-card danger">
        <h3>🗑️ Trash (30 days)</h3>

        {Object.values(trash).length === 0 && (
          <p className="muted">No deleted SOPs</p>
        )}

        {Object.values(trash).map((sop) => (
          <div key={sop.id} className="trash-item">
            <span>{sop.name}</span>
            <button onClick={() => restoreSOP(sop.id)}>Restore</button>
          </div>
        ))}
      </div>

      {/* CONFIRM MODAL */}
      {confirmDelete && (
        <div className="modal-backdrop">
          <div className="modal">
            <h4>Confirm Delete</h4>
            <p>Are you sure you want to delete this SOP?</p>
            <div className="modal-actions">
              <button onClick={deleteSOP} className="danger-btn">
                Yes, Delete
              </button>
              <button onClick={() => setConfirmDelete(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------- Small Components ---------- */

const SOPUploadBlock = ({ label, onUpload }) => (
  <div className="upload-block">
    <span>{label}</span>
    <input
      type="file"
      accept=".pdf"
      onChange={(e) => onUpload(e.target.files[0])}
    />
  </div>
);

const DeleteButton = ({ onClick }) => (
  <button className="delete-btn" onClick={onClick}>
    Delete SOP
  </button>
);
