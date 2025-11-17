import React from "react";

const LabDiagnostics = ({ formData, updateFormData }) => {
  /**
   * ✅ Display logic:
   * Show this section only if:
   * - The officer works in a laboratory, OR
   * - The case has reached "confirmed" classification.
   */
  if (
    formData.placeOfWork !== "laboratory" &&
    formData.caseClassification !== "confirmed"
  ) {
    return null;
  }

  /** ✅ Handle all input changes */
  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    if (type === "checkbox") {
      const updated = checked
        ? [...(formData[name] || []), value]
        : formData[name].filter((v) => v !== value);
      updateFormData(name, updated);
    } else if (type === "file") {
      updateFormData(name, files[0]);
    } else {
      updateFormData(name, value);
    }
  };

  return (
    <section className="form-section">
      <h3>Laboratory & Diagnostics</h3>

      {/* === Specimen Type === */}
      <label>Specimen Type *</label>
      <div className="checkbox-group">
        {[
          "whole_blood",
          "serum",
          "swab",
          "sputum",
          "tissue",
          "csf",
          "faeces",
          "carcass",
        ].map((sp) => (
          <label key={sp}>
            <input
              type="checkbox"
              name="labSampleType"
              value={sp}
              checked={formData.labSampleType?.includes(sp) || false}
              onChange={handleChange}
            />
            {sp.replaceAll("_", " ")}
          </label>
        ))}
      </div>

      {/* === Test Performed === */}
      <label>Test Performed *</label>
      <div className="checkbox-group">
        {["pcr", "rapid_test", "culture", "microscopy", "elisa", "others"].map(
          (test) => (
            <label key={test}>
              <input
                type="checkbox"
                name="labTest"
                value={test}
                checked={formData.labTest?.includes(test) || false}
                onChange={handleChange}
              />
              {test.replaceAll("_", " ")}
            </label>
          )
        )}
      </div>

      {/* === “Other” test field === */}
      {formData.labTest?.includes("others") && (
        <>
          <label>If others, kindly specify *</label>
          <input
            type="text"
            name="otherLabTest"
            value={formData.otherLabTest || ""}
            onChange={handleChange}
            required
          />
        </>
      )}

      {/* === Overall Results === */}
      <label>Overall Test Result *</label>
      <select
        name="labResult"
        value={formData.labResult || ""}
        onChange={handleChange}
        required
      >
        <option value="">-- Select Result --</option>
        <option value="positive">Positive</option>
        <option value="negative">Negative</option>
        <option value="inconclusive">Inconclusive</option>
      </select>

      {/* === Upload Lab Photo === */}
      <label>Upload Lab Diagnosis Picture</label>
      <input
        type="file"
        name="labPhoto"
        accept="image/*"
        onChange={handleChange}
      />
    </section>
  );
};

export default LabDiagnostics;
