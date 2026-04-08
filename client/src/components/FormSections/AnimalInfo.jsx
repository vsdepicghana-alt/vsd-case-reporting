import React, { useEffect } from "react";
import { diseaseConfig } from "../../config/diseaseConfig";

const AnimalInfo = ({ formData, updateFormData }) => {
  const selectedDisease = formData.priorityDiseases?.[0];

  const allowedSpecies =
    diseaseConfig[selectedDisease]?.species || [];

  const requiresVaccination =
    diseaseConfig[selectedDisease]?.requiresVaccination;

  // Handle checkbox (species)
  const handleSpeciesChange = (species, checked) => {
    const updated = checked
      ? [...(formData.species || []), species]
      : formData.species.filter((s) => s !== species);

    updateFormData("species", updated);
  };

  // Handle species-specific ages
  const handleAgeChange = (species, value) => {
    const updatedAges = { ...(formData.ages || {}), [species]: value };
    updateFormData("ages", updatedAges);
  };

  // 🔁 Clear vaccination if not required
  useEffect(() => {
    if (!requiresVaccination && formData.vaccinationStatus) {
      updateFormData("vaccinationStatus", "");
    }
  }, [requiresVaccination, formData.vaccinationStatus, updateFormData]);

  return (
    <section className="form-section">
      <h3>Animal Information</h3>

      {/* Species */}
      <label>Species *</label>
      <div className="checkbox-group">
        {allowedSpecies.map((sp) => (
          <label key={sp}>
            <input
              type="checkbox"
              checked={formData.species?.includes(sp) || false}
              onChange={(e) =>
                handleSpeciesChange(sp, e.target.checked)
              }
            />
            {sp.charAt(0).toUpperCase() + sp.slice(1)}
          </label>
        ))}
      </div>

      {/* If others (only if allowed) */}
      {formData.species?.includes("others") && (
        <>
          <label>If others, kindly specify *</label>
          <input
            type="text"
            value={formData.otherSpecies || ""}
            onChange={(e) => updateFormData("otherSpecies", e.target.value)}
            required
          />
        </>
      )}

      {/* Age per selected species */}
      {formData.species?.map((sp) => (
        <div key={sp}>
          <label>Age ({sp}) *</label>
          <select
            value={formData.ages?.[sp] || ""}
            onChange={(e) => handleAgeChange(sp, e.target.value)}
            required
          >
            <option value="">-- Select Age --</option>

            {sp === "cattle" && (
              <>
                <option value="birth_6m">Birth – 6 months</option>
                <option value="6_18m">6 – 18 months</option>
                <option value="18_plus">&gt; 18 months</option>
              </>
            )}

            {["goat", "sheep", "dog", "cat"].includes(sp) && (
              <>
                <option value="birth_6m">Birth – 6 months</option>
                <option value="6_12m">6 – 12 months</option>
                <option value="12_plus">&gt; 12 months</option>
              </>
            )}

            {sp === "pig" && (
              <>
                <option value="birth_8w">Birth – 8 weeks</option>
                <option value="8w_6m">8 weeks – 6 months</option>
                <option value="6_8m">6 – 8 months</option>
                <option value="8_plus">&gt; 8 months</option>
              </>
            )}

            {sp === "poultry" && (
              <>
                <option value="dayold_6w">Day Old – 6 weeks</option>
                <option value="6_20w">6 – 20 weeks</option>
                <option value="20_plus">&gt; 20 weeks</option>
              </>
            )}

            {sp === "others" && (
              <option value="custom">Custom</option>
            )}
          </select>
        </div>
      ))}

      {/* Sex */}
      {formData.species?.length > 0 &&
        !formData.species.includes("poultry") && (
          <>
            <label>Sex *</label>
            <select
              value={formData.sex || ""}
              onChange={(e) => updateFormData("sex", e.target.value)}
              required
            >
              <option value="">-- Select --</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </>
        )}

      {/* ✅ Vaccination Status (Dynamic) */}
      {requiresVaccination && (
        <>
          <label>Vaccination Status *</label>
          <select
            value={formData.vaccinationStatus || ""}
            onChange={(e) =>
              updateFormData("vaccinationStatus", e.target.value)
            }
            required
          >
            <option value="">-- Select --</option>
            <option value="up_to_date">Up to Date</option>
            <option value="partial">Partial</option>
            <option value="not_vaccinated">Not Vaccinated</option>
            <option value="unknown">Unknown</option>
          </select>
        </>
      )}

      {/* Ownership */}
      <label>Ownership *</label>
      <select
        value={formData.ownership || ""}
        onChange={(e) => updateFormData("ownership", e.target.value)}
        required
      >
        <option value="">-- Select --</option>
        <option value="household">Household</option>
        <option value="farm">Farm</option>
        <option value="stray">Stray</option>
        <option value="wild">Wild</option>
      </select>
    </section>
  );
};

export default AnimalInfo;