import React from "react";

const diseaseSigns = {
  tuberculosis: [
    "chronic_cough",
    "weight_loss",
    "enlarge_lymph_nodes",
    "emaciation",
    "respiratory_distress",
    "others",
  ],
  rabies: [
    "aggression",
    "hyper_salivation",
    "paralysis",
    "difficult_swallowing",
    "others",
  ],
  viral_haemorrhagic_fever: [
    "high_fever",
    "bleeding",
    "haemorrhage",
    "vomiting_diarrhoea",
    "severe_weakness",
    "others",
  ],
  anthrax: [
    "sudden_death",
    "bleeding_from_orifice",
    "lack_of_rigor_mortis",
    "edema_swelling_neck_or_chest",
    "others",
  ],
  avian_influenza: [
    "sudden_death",
    "respiratory_signs",
    "cyanosis_of_comb_wattles",
    "drop_in_egg_production",
    "neurological_signs",
    "others",
  ],
  trypanosomiasis: [
    "anaemia",
    "pale_mucosa",
    "weight_loss",
    "intermittent_fever",
    "edema",
    "lacrimation",
    "eye_discharge",
    "others",
  ],
};

const ClinicalInfo = ({ formData, updateFormData }) => {
  const selectedDiseases = formData.priorityDiseases || [];

  // ✅ Handle checkbox toggle for each disease & sign
  const handleSignChange = (disease, sign, checked) => {
    const updated = { ...(formData.clinicalSigns || {}) };
    const currentSigns = updated[disease] || [];

    if (checked) {
      updated[disease] = [...currentSigns, sign];
    } else {
      updated[disease] = currentSigns.filter((s) => s !== sign);
    }

    updateFormData("clinicalSigns", updated);
  };

  return (
    <section className="form-section">
      <h3>Clinical Signs & Case Classification</h3>

      {/* Onset Date */}
      <label>Onset Date *</label>
      <input
        type="date"
        value={formData.onsetDate || ""}
        onChange={(e) => updateFormData("onsetDate", e.target.value)}
        required
      />

      {/* Disease-specific clinical signs */}
      {selectedDiseases.length > 0 ? (
        selectedDiseases.map((disease) => (
          <div key={disease} style={{ marginTop: "1rem" }}>
            <label>
              {disease.replaceAll("_", " ")} (Key Clinical Signs)
            </label>

            <div className="checkbox-group">
              {diseaseSigns[disease]?.map((sign) => (
                <label key={sign}>
                  <input
                    type="checkbox"
                    checked={
                      formData.clinicalSigns?.[disease]?.includes(sign) || false
                    }
                    onChange={(e) =>
                      handleSignChange(disease, sign, e.target.checked)
                    }
                  />
                  {sign.replaceAll("_", " ")}
                </label>
              ))}
            </div>

            {/* If "others" selected, show input */}
            {formData.clinicalSigns?.[disease]?.includes("others") && (
              <>
                <label>If others (for {disease}), kindly specify *</label>
                <input
                  type="text"
                  value={formData[`other_${disease}`] || ""}
                  onChange={(e) =>
                    updateFormData(`other_${disease}`, e.target.value)
                  }
                  required
                />
              </>
            )}
          </div>
        ))
      ) : (
        <p style={{ color: "gray" }}>
          ⚠️ No disease selected. Please select one in “General Case Info”.
        </p>
      )}

      {/* Case Classification */}
      <label>Case Classification *</label>
      <select
        value={formData.caseClassification || ""}
        onChange={(e) => updateFormData("caseClassification", e.target.value)}
        required
      >
        <option value="">-- Select --</option>
        <option value="suspected">Suspected</option>
        <option value="probable">Probable</option>
        <option value="confirmed">Confirmed</option>
      </select>
    </section>
  );
};

export default ClinicalInfo;
