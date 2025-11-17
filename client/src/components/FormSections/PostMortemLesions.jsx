import React from "react";

const PostMortemLesions = ({ formData, updateFormData }) => {
  const disease = formData.priorityDiseases?.[0]; // use first selected disease
  const caseClassification = formData.caseClassification;

  // Skip rendering if confirmed — no lesions needed
  if (caseClassification === "confirmed") return null;

  // --- Handle changes ---
  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    if (type === "checkbox") {
      const updated = formData[name] ? [...formData[name]] : [];
      if (checked) {
        updated.push(value);
      } else {
        const index = updated.indexOf(value);
        if (index > -1) updated.splice(index, 1);
      }
      updateFormData(name, updated);
    } else if (type === "file") {
      updateFormData(name, files[0]);
    } else {
      updateFormData(name, value);
    }
  };

  // --- Render Lesion Section Helper ---
  const renderLesionSection = (title, keyPrefix, lesions) => (
    <>
      <label>{title}</label>
      <div className="checkbox-group">
        {lesions.map((lesion) => (
          <label key={lesion}>
            <input
              type="checkbox"
              name={`${keyPrefix}Lesions`}
              value={lesion}
              checked={formData[`${keyPrefix}Lesions`]?.includes(lesion) || false}
              onChange={handleChange}
            />
            {lesion.replaceAll("_", " ")}
          </label>
        ))}
      </div>

      {/* If "Others" selected */}
      {formData[`${keyPrefix}Lesions`]?.includes("others") && (
        <>
          <label>If others, kindly specify *</label>
          <input
            type="text"
            name={`other${keyPrefix.charAt(0).toUpperCase() + keyPrefix.slice(1)}`}
            value={formData[`other${keyPrefix.charAt(0).toUpperCase() + keyPrefix.slice(1)}`] || ""}
            onChange={handleChange}
            required
          />
        </>
      )}

      {/* Upload photo */}
      <label>Upload Picture ({title})</label>
      <input
        type="file"
        name={`${keyPrefix}Photo`}
        accept="image/*"
        onChange={handleChange}
      />
    </>
  );

  return (
    <section className="form-section">
      <h3>🔬 Post-Mortem Lesions</h3>

      {disease === "tuberculosis" &&
        renderLesionSection("Tuberculosis Lesions", "tb", [
          "pale_yellow_nodules_in_lungs",
          "pale_yellow_nodules_in_lymph_nodes",
          "pale_yellow_nodules_in_liver",
          "pale_yellow_nodules_in_spleen",
          "caseous_necrosis",
          "calcification",
          "enlarged_bronchial_lymph_nodes",
          "pleura_adhesions",
          "localised_lesions",
          "others",
        ])}

      {disease === "trypanosomiasis" &&
        renderLesionSection("Trypanosomiasis Lesions", "tryp", [
          "emaciation_and_anaemia",
          "enlarged_lymph_nodes",
          "hepatomegaly_and_splenomegaly",
          "serous_edema",
          "petechial_haemorrhages",
          "ascites_hydrothorax",
          "others",
        ])}

      {disease === "avian_influenza" &&
        renderLesionSection("Avian Influenza Lesions", "avian", [
          "haemorrhages_comb_wattles_organs",
          "cyanosis_comb_wattles",
          "congested_lungs",
          "haemorrhages_proventriculus",
          "swollen_spleen",
          "edematous_face_head",
          "ovarian_haemorrhage",
          "others",
        ])}

      {!["tuberculosis", "trypanosomiasis", "avian_influenza"].includes(disease) && (
        <p>⚠️ Post-mortem lesions are not applicable for this disease.</p>
      )}
    </section>
  );
};

export default PostMortemLesions;
