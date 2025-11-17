import React from "react";

const AnimalInfo = ({ formData, updateFormData }) => {
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

  return (
    <section className="form-section">
      <h3>Animal Information</h3>

      {/* Species */}
      <label>Species *</label>
      <div className="checkbox-group">
        {[
          "cattle",
          "goat",
          "sheep",
          "pig",
          "dog",
          "cat",
          "poultry",
          "others",
        ].map((sp) => (
          <label key={sp}>
            <input
              type="checkbox"
              checked={formData.species?.includes(sp) || false}
              onChange={(e) => handleSpeciesChange(sp, e.target.checked)}
            />
            {sp.charAt(0).toUpperCase() + sp.slice(1)}
          </label>
        ))}
      </div>

      {/* If others */}
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
            {sp === "goat" && (
              <>
                <option value="birth_6m">Birth – 6 months</option>
                <option value="6_12m">6 – 12 months</option>
                <option value="12_plus">&gt; 12 months</option>
              </>
            )}
            {sp === "sheep" && (
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
            {sp === "dog" && (
              <>
                <option value="birth_6m">Birth – 6 months</option>
                <option value="6_12m">6 – 12 months</option>
                <option value="12_plus">&gt; 12 months</option>
              </>
            )}
            {sp === "cat" && (
              <>
                <option value="birth_6m">Birth – 6 months</option>
                <option value="6_12m">6 – 12 months</option>
                <option value="12_plus">&gt; 12 months</option>
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
              <option value="custom">Custom (enter manually later)</option>
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

      {/* Vaccination Status */}
      <label>Vaccination Status *</label>
      <select
        value={formData.vaccinationStatus || ""}
        onChange={(e) => updateFormData("vaccinationStatus", e.target.value)}
        required
      >
        <option value="">-- Select --</option>
        <option value="up_to_date">Up to Date</option>
        <option value="partial">Partial</option>
        <option value="not_vaccinated">Not Vaccinated</option>
        <option value="unknown">Unknown</option>
      </select>

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
