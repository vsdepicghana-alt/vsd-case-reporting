import React from "react";

/**
 * SampleReferral
 * - Pure data-entry component for sample referrals.
 * - Does NOT send emails itself. The final submission (FormApp.handleSubmit)
 *   will send the referral email after the Case ID is generated.
 */
const SampleReferral = ({ formData, updateFormData }) => {
  // Predefined list of labs (placeholder emails managed in FormApp)
  const labList = [
    "Takoradi Veterinary Lab",
    "Kumasi Veterinary Lab",
    "Accra Veterinary Lab",
    "Central Veterinary Lab Pong Tamale",
  ];

  // List of common sample types
  const sampleTypes = [
    "Blood Sample",
    "Tissue Sample",
    "Saliva Sample",
    "Swab",
    "Serum Sample",
    "Brain Tissue",
  ];

  const handleReferralChange = (e) => {
    const value = e.target.value;
    updateFormData("sendToLab", value);
    if (value === "no") {
      updateFormData("sampleType", "");
      updateFormData("selectedLab", "");
    }
  };

  return (
    <section className="form-section">
      <h3>🧫 Sample Referral</h3>

      <label>Would you like to send a sample to the laboratory?</label>
      <select
        value={formData.sendToLab || ""}
        onChange={handleReferralChange}
        required
      >
        <option value="">-- Select --</option>
        <option value="yes">Yes</option>
        <option value="no">No</option>
      </select>

      {formData.sendToLab === "yes" && (
        <>
          <label>Sample Type *</label>
          <select
            value={formData.sampleType || ""}
            onChange={(e) => updateFormData("sampleType", e.target.value)}
            required
          >
            <option value="">-- Select Sample Type --</option>
            {sampleTypes.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>

          <label>Select Nearest Laboratory *</label>
          <select
            value={formData.selectedLab || ""}
            onChange={(e) => updateFormData("selectedLab", e.target.value)}
            required
          >
            <option value="">-- Select Laboratory --</option>
            {labList.map((lab) => (
              <option key={lab} value={lab}>
                {lab}
              </option>
            ))}
          </select>

          <p style={{ marginTop: 12, color: "#155724", background: "#d4edda", padding: 10, borderRadius: 6 }}>
            ✅ Note: The referral email will be sent automatically when you submit the full case.
            The final submission generates the Case ID and ensures the lab receives the correct ID.
          </p>
        </>
      )}

      {formData.sendToLab === "no" && (
        <p style={{ marginTop: 12, color: "#856404", background: "#fff3cd", padding: 10, borderRadius: 6 }}>
          No sample will be referred for this case.
        </p>
      )}
    </section>
  );
};

export default SampleReferral;