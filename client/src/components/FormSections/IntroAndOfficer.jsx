import React, { useState, useEffect } from "react";

const IntroAndOfficer = ({
  formData,
  updateFormData,
  handleLoadCaseByID,
  readOnly,
}) => {
  const [labMode, setLabMode] = useState("");
  const [caseIDInput, setCaseIDInput] = useState("");
  const [isLabLocked, setIsLabLocked] = useState(false);

  // 🔐 Get currently logged user
  const loggedUser = JSON.parse(localStorage.getItem("loggedUser") || "null");
  const isOfficer = loggedUser?.role === "officer";

  // ⭐ AUTO-FILL OFFICER DETAILS (runs once)
  useEffect(() => {
    if (isOfficer && loggedUser) {
      updateFormData("officerId", loggedUser.staffId || "");
      updateFormData("officerName", loggedUser.name || "");
      updateFormData("jobDescription", loggedUser.jobDescription || "");
      updateFormData("contactNumber", loggedUser.contactNumber || "");
    }
  }, []); // runs only once on page load

  // Reset lab mode if place of work changes
  useEffect(() => {
    if (formData.placeOfWork !== "laboratory") {
      setLabMode("");
      setIsLabLocked(false);
    }
  }, [formData.placeOfWork]);

  // Lock fields in lab mode until selection made
  useEffect(() => {
    if (formData.placeOfWork === "laboratory") {
      setIsLabLocked(labMode === "");
    } else {
      setIsLabLocked(false);
    }
  }, [labMode, formData.placeOfWork]);

  const handleCaseIDSubmit = () => {
    if (!caseIDInput.trim()) {
      alert("⚠️ Please enter a Case ID.");
      return;
    }
    handleLoadCaseByID(caseIDInput.trim());
  };

  return (
    <section className="form-section">
      <h2>📋 Introduction</h2>

      <p>
        This initiative, led by the <b>Veterinary Services Directorate</b> in
        collaboration with <b>EpiC Ghana</b>, aims to establish a comprehensive
        surveillance system for six prioritized zoonotic diseases.
      </p>

      <h3> Reporting Officer</h3>

      {/* ---------------- OFFICER DETAILS ---------------- */}
      <div className="form-grid">
        {/* Officer ID */}
        <div className="form-field">
          <label>Officer ID *</label>
          <input
            type="text"
            value={formData.officerId || ""}
            onChange={(e) => updateFormData("officerId", e.target.value)}
            required
            disabled={isOfficer || readOnly || isLabLocked}
          />
        </div>

        {/* Officer Name */}
        <div className="form-field">
          <label>Officer Name *</label>
          <input
            type="text"
            value={formData.officerName || ""}
            onChange={(e) => updateFormData("officerName", e.target.value)}
            required
            disabled={isOfficer || readOnly || isLabLocked}
          />
        </div>

        {/* Job Description */}
        <div className="form-field">
          <label>Job Description *</label>
          <select
            value={formData.jobDescription || ""}
            onChange={(e) => updateFormData("jobDescription", e.target.value)}
            required
            disabled={isOfficer || readOnly || isLabLocked}
          >
            <option value="">-- Select Job --</option>
            <option value="veterinarian">Veterinarian</option>
            <option value="technologist">Technologist</option>
            <option value="animal_health_officer">Animal Health Officer</option>
          </select>
        </div>

        {/* Contact Number */}
        <div className="form-field">
          <label>Contact Number *</label>
          <input
            type="tel"
            value={formData.contactNumber || ""}
            onChange={(e) => updateFormData("contactNumber", e.target.value)}
            placeholder="e.g. 0241231234"
            required
            disabled={isOfficer || readOnly || isLabLocked}
          />
        </div>
      </div>

      {/* ---------------- PLACE OF WORK ---------------- */}
      <div className="form-field" style={{ marginTop: "1rem" }}>
        <label>Place of Work *</label>
        <select
          value={formData.placeOfWork || ""}
          onChange={(e) => updateFormData("placeOfWork", e.target.value)}
          required
          disabled={readOnly}
        >
          <option value="">-- Select Place --</option>
          <option value="clinic">Clinic</option>
          <option value="field">Field</option>
          <option value="abattoir">Abattoir</option>
          <option value="laboratory">Laboratory</option>
          <option value="others">Others</option>
        </select>

        {formData.placeOfWork === "others" && (
          <>
            <label>If others, please specify *</label>
            <input
              type="text"
              value={formData.otherPlace || ""}
              onChange={(e) => updateFormData("otherPlace", e.target.value)}
              required
              disabled={readOnly}
            />
          </>
        )}
      </div>

      {/* ---------------- LABORATORY WORKFLOW ---------------- */}
      {formData.placeOfWork === "laboratory" && (
        <div
          className="lab-options"
          style={{
            marginTop: "1.5rem",
            padding: "1rem",
            border: "1px solid #ccc",
            borderRadius: "8px",
            background: "#f9f9f9",
          }}
        >
          <h4>Laboratory Workflow</h4>
          <p>Select how you want to proceed:</p>

          <div style={{ display: "flex", gap: "1rem" }}>
            <button
              type="button"
              onClick={() => setLabMode("new")}
              style={{
                background: labMode === "new" ? "#007bff" : "#eee",
                color: labMode === "new" ? "#fff" : "#000",
              }}
            >
              Input New Case Data
            </button>

            <button
              type="button"
              onClick={() => setLabMode("existing")}
              style={{
                background: labMode === "existing" ? "#007bff" : "#eee",
                color: labMode === "existing" ? "#fff" : "#000",
              }}
            >
              Load Case via Case ID
            </button>
          </div>

          {labMode === "existing" && (
            <div className="case-id-loader" style={{ marginTop: "1rem" }}>
              <label>Enter Case ID:</label>
              <input
                type="text"
                placeholder="e.g. ASH-OBU-TUB-20251005-002"
                value={caseIDInput}
                onChange={(e) => setCaseIDInput(e.target.value)}
                disabled={readOnly}
              />
              <button
                type="button"
                onClick={handleCaseIDSubmit}
                style={{ marginLeft: "10px" }}
                disabled={readOnly}
              >
                Load Case
              </button>
            </div>
          )}
        </div>
      )}

      {formData.placeOfWork === "laboratory" && labMode === "" && (
        <p style={{ color: "#c00", marginTop: "10px" }}>
          ⚠️ Please select “Input New Case Data” or “Load Case via Case ID”.
        </p>
      )}
    </section>
  );
};

export default IntroAndOfficer;