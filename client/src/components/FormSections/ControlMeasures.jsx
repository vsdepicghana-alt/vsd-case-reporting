import React from "react";

const ControlMeasures = ({ formData, updateFormData }) => {
  // --- Handle input changes ---
  const handleChange = (e) => {
    const { name, value } = e.target;
    updateFormData(name, value);
  };

  return (
    <section className="form-section">
      <h3>Control Measures</h3>

      {/* Treatment Given */}
      <label>Treatment Given</label>
      <select
        name="treatmentGiven"
        value={formData.treatmentGiven || ""}
        onChange={handleChange}
      >
        <option value="">-- Select --</option>
        <option value="yes">Yes</option>
        <option value="no">No</option>
        <option value="unknown">Unknown</option>
      </select>

      {/* Vaccination Campaign */}
      <label>Vaccination Campaign Conducted</label>
      <select
        name="vaccinationCampaign"
        value={formData.vaccinationCampaign || ""}
        onChange={handleChange}
      >
        <option value="">-- Select --</option>
        <option value="yes">Yes</option>
        <option value="no">No</option>
        <option value="unknown">Unknown</option>
      </select>

      {/* Animal Movement Restriction */}
      <label>Animal Movement Restriction *</label>
      <select
        name="movementRestriction"
        value={formData.movementRestriction || ""}
        onChange={handleChange}
        required
      >
        <option value="">-- Select --</option>
        <option value="yes">Yes</option>
        <option value="no">No</option>
        <option value="unknown">Unknown</option>
      </select>

      {/* Community Sensitization */}
      <label>Community Sensitization *</label>
      <select
        name="communitySensitization"
        value={formData.communitySensitization || ""}
        onChange={handleChange}
        required
      >
        <option value="">-- Select --</option>
        <option value="yes">Yes</option>
        <option value="no">No</option>
        <option value="unknown">Unknown</option>
      </select>
    </section>
  );
};

export default ControlMeasures;
